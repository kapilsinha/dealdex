// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./CloneFactory.sol";
import "./enums/VestingStrategy.sol";
import "./interfaces/ILockableDeal.sol";
import "./structs/DealConfig.sol";
import "./structs/InvestmentKey.sol";
import "./structs/Overrides.sol";

// Upgradable contract (deployed via proxy)
contract DealFactory is CloneFactory, Initializable {

    // State Variables
    // Because this contract is upgradable, you can NEVER replace or remove existing state
    // variables (storage collision). You are free to append to it
    address public dealContractAddress;
    address public dealdexAddress;

    // Initializer
    // You CANNOT have a 'constructor' in this contract because it is upgradable
    // and constructors are not deployed in the runtime bytecode. Thus we
    // use a normal 'initializer' function (the name of this function is specified
    // in the deployProxy) and use Initializable to ensure it's called exactly once
    function initialize(address _dealContractAddress, address _dealdexAddress) public initializer {
        dealContractAddress = _dealContractAddress;
        dealdexAddress = _dealdexAddress;
    }

    // Events
    event DealCreated(address indexed creator, address indexed project, address dealAddress);

    // Fee setter
    function calcDealDexFees(DealConfig memory) internal pure returns (uint16, uint16) {
        // Returns (claimTokens fee bps, claimFunds fee bps)
        return (0, 250);
    }

    // Public Functions
    function createDeal(DealConfig memory _dealConfig) public {
        (uint16 tokenFeeBps, uint16 fundFeeBps) = calcDealDexFees(_dealConfig);
        _dealConfig.participantAddresses.dealdex = dealdexAddress;
        _dealConfig.tokensConfig.dealdexFeeBps = tokenFeeBps;
        _dealConfig.fundsConfig.dealdexFeeBps = fundFeeBps;

        Deal deal = Deal(createClone(dealContractAddress));
        deal.init(_dealConfig);
        emit DealCreated(msg.sender, _dealConfig.participantAddresses.project, address(deal));
    }
}


contract Deal is ILockableDeal {

    DealConfig public config;

    // List of investmentKeys in order of investment (ordering is important for time-ordered vesting)
    InvestmentKey[] public investmentKeys;

    // Address -> ID -> amt
    // Case 1 (config.investorConfig.investmentKeyType == InvestmentKeyType.INVESTOR_WALLET):
    //  (investor wallet address) -> (ID 0) -> amt
    // Case 2 (config.investorConfig.investmentKeyType == InvestmentKeyType.GATE_TOKEN):
    //  (NFT contract address) -> (NFT ID) -> amt
    mapping(address => mapping(uint256 => uint256)) public investmentKeyToReceivedFunds;
    mapping(address => mapping(uint256 => uint256)) public investmentKeyToClaimedTokens;
    mapping(address => mapping(uint256 => uint256)) public investmentKeyToReceivedManagerFeeTokens;
    mapping(address => mapping(uint256 => uint256)) public investmentKeyToReceivedDealdexFeeTokens;

    uint256 receivedManagerFeeFunds;
    uint256 receivedDealdexFeeFunds;
    uint256 public totalReceivedInvestment;
    bool public isLockedFlag;

    // Overrides allowing DealDex to provide a hard reset
    Overrides public overrides;

    // Events
    event InvestUpdate(address indexed investor, uint256 indexed nftId, uint256 investedAmt, uint256 totalFunds);

    // Initializers

    function init(DealConfig calldata _dealConfig) external {
        validateDealConfig(_dealConfig);
        config = _dealConfig;
        isLockedFlag = (config.investConfig.sizeConstraints.minTotalInvestment == 0);
    }

    function invest(uint256 amount, uint256 id) external override {
        require(getInvestmentKeyDict(investmentKeyToReceivedFunds, id) == 0, "Cannot invest multiple times");
        require(amount >= config.investConfig.sizeConstraints.minInvestmentPerInvestor, "Investment amount is too low");
        require(amount <= config.investConfig.sizeConstraints.maxInvestmentPerInvestor, "Investment amount is too high");
        require(amount + totalReceivedInvestment <= config.investConfig.sizeConstraints.maxTotalInvestment, "Investment will exceed total investment cap");
        require(!deadlineHasPassed(), "Investment deadline has passed");
        require(address(0) == config.investConfig.gateToken || IERC721(config.investConfig.gateToken).ownerOf(id) == msg.sender, "Investor does not own the requisite NFT for this gated deal");
        require(isValidLockStatus(config.investConfig.lockConstraint), string(abi.encodePacked("Cannot invest because the deal is ", (!isLockedFlag ? "un" : ""), "locked")));

        IERC20 investmentToken = IERC20(config.investConfig.investmentTokenAddress);
        require(investmentToken.allowance(msg.sender, address(this)) >= amount, "Investor has not approved sufficient funds to invest");

        setInvestmentKeyDict(investmentKeyToReceivedFunds, id, amount);
        totalReceivedInvestment += amount;
        bool success = investmentToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Failed to invest tokens");
        // The funds are locked once the investment goal has been reached
        isLockedFlag = (totalReceivedInvestment >= config.investConfig.sizeConstraints.minTotalInvestment);
        investmentKeys.push(getInvestmentKey(id));
        emit InvestUpdate(msg.sender, id, amount, totalReceivedInvestment);
    }

    // The project can claim all funds as long as the deadline has passed and the deal is valid
    function claimFunds() external override {
        require(msg.sender == config.participantAddresses.project, "Only the project can claim the funds");
        require(isValidLockStatus(config.fundsConfig.lockConstraint), string(abi.encodePacked("Cannot claim funds because the deal is ", (!isLockedFlag ? "un" : ""), "locked")));

        IERC20 investmentToken = IERC20(config.investConfig.investmentTokenAddress);

        // If we want to make sure tokens have been deposited before fund withdrawal, we can make that check here
        uint256 balance = investmentToken.balanceOf(address(this));

        uint256 dealdexFee = balance * config.fundsConfig.dealdexFeeBps / 10000;
        require(dealdexFee >= receivedDealdexFeeFunds, "DealDex has received more funds than it should have. Attempted reentrancy attack?!");
        uint256 pendingDealdexFee = dealdexFee - receivedDealdexFeeFunds;
        if (pendingDealdexFee > 0) {
            receivedDealdexFeeFunds += pendingDealdexFee;
            bool dealdexFeeSuccess = investmentToken.transfer(config.participantAddresses.dealdex, pendingDealdexFee);
            require(dealdexFeeSuccess, "Investment fee to DealDex failed.");
        }

        uint256 managerFee = balance * config.fundsConfig.managerFeeBps / 10000;
        require(managerFee >= receivedManagerFeeFunds, "Syndicate manager has received more funds than it should have. Attempted reentrancy attack?!");
        uint256 pendingManagerFee = managerFee - receivedManagerFeeFunds;
        if (pendingManagerFee > 0) {
            receivedManagerFeeFunds += pendingManagerFee;
            bool managerFeeSuccess = investmentToken.transfer(config.participantAddresses.manager, pendingManagerFee);
            require(managerFeeSuccess, "Investment fee to syndicate manager failed.");
        }

        require(investmentToken.balanceOf(address(this)) == balance - pendingDealdexFee - pendingManagerFee, "Remaining balance does match original balance minus fees");
        bool transferSuccess = investmentToken.transfer(config.participantAddresses.project, balance - pendingDealdexFee - pendingManagerFee);
        require(transferSuccess, "Failed to transfer funds to the investor.");
    }

    // Investors can get a refund as long as the investment deadline has not passed or if the deal is invalid.
    function claimRefund(uint256 id) external override {
        if (! overrides.forceAllowRefunds) {
            require(config.refundConfig.allowRefunds, "Deal disallows refunds");
            require(isValidLockStatus(config.refundConfig.lockConstraint), string(abi.encodePacked("Cannot claim refund because the deal is ", (!isLockedFlag ? "un" : ""), "locked")));
        }

        uint256 amountToRefund = getInvestmentKeyDict(investmentKeyToReceivedFunds, id);
        require(amountToRefund > 0, "Zero invested! Only an investor can receive a refund");

        InvestmentKey memory key = getInvestmentKey(id);
        for(uint i = 0; i < investmentKeys.length; i++){
            if (investmentKeys[i].addr == key.addr && investmentKeys[i].id == key.id) {
                delete investmentKeys[i];
            }
        }
        totalReceivedInvestment -= amountToRefund;

        setInvestmentKeyDict(investmentKeyToReceivedFunds, id, 0);
        bool success = IERC20(config.investConfig.investmentTokenAddress).transfer(msg.sender, amountToRefund);
        require(success, "Failed to transfer the refunded amount");
        emit InvestUpdate(msg.sender, id, 0, totalReceivedInvestment);
    }


    // Investors can claim tokens as long as they have invested, have not claimed their tokens yet, and the contract has tokens
    function claimTokens(uint256 id) external override {
        require(address(0) != config.tokensConfig.projectTokenAddress, "Project token not yet specified");
        require(isValidLockStatus(config.tokensConfig.lockConstraint), string(abi.encodePacked("Cannot claim tokens because the deal is ", (!isLockedFlag ? "un" : ""), "locked")));
        uint256 vestedTokens = getTotalVestedTokens(id);
        require(vestedTokens > 0, "Zero tokens have been vested to the investor");

        uint256 dealdexFeeTokens = vestedTokens * config.tokensConfig.dealdexFeeBps / 10000;
        require(dealdexFeeTokens >= getInvestmentKeyDict(investmentKeyToReceivedDealdexFeeTokens, id), "DealDex has received more tokens than have been vested. Attempted reentrancy attack?!");
        uint256 managerFeeTokens = vestedTokens * config.tokensConfig.managerFeeBps / 10000;
        require(managerFeeTokens >= getInvestmentKeyDict(investmentKeyToReceivedManagerFeeTokens, id), "Manager has received more tokens than have been vested. Attempted reentrancy attack?!");
        uint256 investorTokens   = vestedTokens - managerFeeTokens - dealdexFeeTokens;
        require(investorTokens   >= getInvestmentKeyDict(investmentKeyToClaimedTokens, id), "Investor has claimed more tokens than have been vested. Attempted reentrancy attack?!");

        uint256 pendingDealdexFeeTokens = dealdexFeeTokens - getInvestmentKeyDict(investmentKeyToReceivedDealdexFeeTokens, id);
        uint256 pendingManagerFeeTokens = managerFeeTokens - getInvestmentKeyDict(investmentKeyToReceivedManagerFeeTokens, id);
        uint256 pendingInvestorTokens   = investorTokens   - getInvestmentKeyDict(investmentKeyToClaimedTokens, id);

        IERC20 projectToken = IERC20(config.tokensConfig.projectTokenAddress);
        uint256 availableTokens = projectToken.balanceOf(address(this));
        require(availableTokens >= pendingDealdexFeeTokens + pendingManagerFeeTokens + pendingInvestorTokens, "Contract does not have enough tokens to send");

        if (pendingDealdexFeeTokens > 0) {
            setInvestmentKeyDict(investmentKeyToReceivedDealdexFeeTokens, id, dealdexFeeTokens);
            require(projectToken.transfer(config.participantAddresses.dealdex, pendingDealdexFeeTokens), "Token fee to DealDex failed");
        }

        if (pendingManagerFeeTokens > 0) {
            setInvestmentKeyDict(investmentKeyToReceivedManagerFeeTokens, id, managerFeeTokens);
            require(projectToken.transfer(config.participantAddresses.manager, pendingManagerFeeTokens), "Token fee to syndicate manager fee failed");
        }

        if (pendingInvestorTokens > 0) {
            setInvestmentKeyDict(investmentKeyToClaimedTokens, id, investorTokens);
            require(projectToken.transfer(msg.sender, pendingInvestorTokens), "Transfer of tokens to the investor failed");
        }
    }

    // Setters
    function setProjectTokenDetails(address _projectTokenAddress, uint256 _exchangeRateNum, uint256 _exchangeRateDenom) external {
        require(msg.sender == config.participantAddresses.project, "Only the project can set the project token");
        require(config.tokensConfig.projectTokenAddress == address(0), "The project already set the project token; it cannot be changed");
        config.tokensConfig.projectTokenAddress = _projectTokenAddress;
        config.exchangeRate.numerator = _exchangeRateNum;
        config.exchangeRate.denominator = _exchangeRateDenom;
    }

    // We can enforce that the new fee is <= the old fees, but are skipping that for now for flexibility
    function setDealDexFees(uint16 fundFeeBps, uint16 tokenFeeBps) external {
        require(msg.sender == config.participantAddresses.dealdex, "Only DealDex can update its fees");
        config.fundsConfig.dealdexFeeBps = fundFeeBps;
        config.tokensConfig.dealdexFeeBps = tokenFeeBps;
    }

    function setManagerFees(uint16 fundFeeBps, uint16 tokenFeeBps) external {
        require(msg.sender == config.participantAddresses.manager, "Only the syndicate manager can update its fees");
        config.fundsConfig.managerFeeBps = fundFeeBps;
        config.tokensConfig.managerFeeBps = tokenFeeBps;
    }
    
    // Overrides
    function setForceAllowRefund(bool val) external {
        require(msg.sender == config.participantAddresses.dealdex, "Only DealDex can force allow refunds");
        overrides.forceAllowRefunds = val;
    }

    // Getters
    function isLocked() external view override returns(bool) {
        return isLockedFlag;
    }

    function getInvestors() external view returns(InvestmentKey[] memory _investmentKeys, 
                                                    uint256[] memory _investments,
                                                    uint256[] memory _claimedTokens,
                                                    uint256[] memory _managerFeeTokens,
                                                    uint256[] memory _dealdexFeeTokens) {
        _investmentKeys = new InvestmentKey[](investmentKeys.length);
        _investments = new uint256[](investmentKeys.length);
        _claimedTokens = new uint256[](investmentKeys.length);
        _managerFeeTokens = new uint256[](investmentKeys.length);
        _dealdexFeeTokens = new uint256[](investmentKeys.length);
        
       for(uint i = 0; i < investmentKeys.length; i++){
            _investmentKeys[i] = investmentKeys[i];
            address keyAddr = investmentKeys[i].addr;
            uint256 keyId = investmentKeys[i].id;
            _investments[i] = investmentKeyToReceivedFunds[keyAddr][keyId];
            _claimedTokens[i] = investmentKeyToClaimedTokens[keyAddr][keyId];
            _managerFeeTokens[i] = investmentKeyToReceivedManagerFeeTokens[keyAddr][keyId];
            _dealdexFeeTokens[i] = investmentKeyToReceivedDealdexFeeTokens[keyAddr][keyId];
        }
    }

    // Private Helper Functions
    function validateDealConfig(DealConfig calldata dealConfig) internal view {
        validateVestingSchedule(dealConfig.vestingSchedule);
        require(config.investConfig.investmentKeyType != InvestmentKeyType.GATE_TOKEN || address(0) != config.investConfig.gateToken, "Gate token must be specified since investment key type is gate token");
    }

    function validateVestingSchedule(VestingSchedule calldata vestingSchedule) internal pure {
        require(vestingSchedule.vestingStrategy != VestingStrategy.SIZE_INC, "Investment-size sorted vesting is not implemented");
        require(vestingSchedule.vestingBps.length > 0, "Vesting schedule cannot be empty");
        require(vestingSchedule.vestingBps.length == vestingSchedule.vestingTimestamps.length, "Vesting bps must have the same size (1 on 1 correspondence) as vesting timestamps");
        for (uint i = 1; i < vestingSchedule.vestingBps.length; i++) {
            require(vestingSchedule.vestingTimestamps[i] > vestingSchedule.vestingTimestamps[i - 1], "Vesting timeline must contain strictly increasing timestamps");
            require(vestingSchedule.vestingBps[i] > vestingSchedule.vestingBps[i - 1], "Vested amounts must be strictly increasing with time");
        }
        require(vestingSchedule.vestingBps[vestingSchedule.vestingBps.length - 1] == 10000, "End of vesting must yield 100% of tokens");
    }

    function getInvestmentKey(uint256 id) view internal returns (InvestmentKey memory) {
        InvestmentKey memory key;
        key.id = id;
        if (config.investConfig.investmentKeyType == InvestmentKeyType.INVESTOR_WALLET) {
            require(id == 0, "Id must be 0 for investor wallet investment key type");
            key.addr = msg.sender;
        }
        else if (config.investConfig.investmentKeyType == InvestmentKeyType.GATE_TOKEN) {
            key.addr = config.investConfig.gateToken;
        }
        else {
            require(false, "Unsupported investment key type");
        }
        return key;
    }

    function getInvestmentKeyDict(mapping(address => mapping(uint256 => uint256)) storage dict, uint256 id) view internal returns (uint256) {
        if (config.investConfig.investmentKeyType == InvestmentKeyType.INVESTOR_WALLET) {
            require(id == 0, "Investments are associated with wallet so id must be 0");
            return dict[msg.sender][id];
        }
        if (config.investConfig.investmentKeyType == InvestmentKeyType.GATE_TOKEN) {
             return dict[config.investConfig.gateToken][id];
        }
        require(false, "Invalid investment key");
        return 0;
    }

    function setInvestmentKeyDict(mapping(address => mapping(uint256 => uint256)) storage dict, uint256 id, uint256 amt) internal {
        if (config.investConfig.investmentKeyType == InvestmentKeyType.INVESTOR_WALLET) {
            require(id == 0, "Investments are associated with wallet so id must be 0");
            dict[msg.sender][id] = amt;
        }
        else if (config.investConfig.investmentKeyType == InvestmentKeyType.GATE_TOKEN) {
             dict[config.investConfig.gateToken][id] = amt;
        }
    }

    function deadlineHasPassed() internal view returns (bool) {
        return block.timestamp > config.investConfig.investmentDeadline;
    }

    function isValidLockStatus(LockedDealConstraint c) internal view returns (bool) {
        return ((c == LockedDealConstraint.NO_CONSTRAINT) ||
                (c == LockedDealConstraint.REQUIRE_LOCKED && isLockedFlag) ||
                (c == LockedDealConstraint.REQUIRE_UNLOCKED && !isLockedFlag));
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function investmentAmtToTokens(uint256 amount) internal view returns (uint256) {
        return amount * config.exchangeRate.numerator / config.exchangeRate.denominator;
    }

    // This DOES NOT account for the number of tokens that the investor has already claimed or fees
    // e.g. if 200 tokens have been vested and the vestor has already claimed 100 and syndicate manager takes 20 tokens,
    // this function will still return 200
    function getTotalVestedTokens(uint256 id) view public returns (uint256) {
        require(config.vestingSchedule.vestingStrategy != VestingStrategy.SIZE_INC, "Investment-size sorted vesting is unsupported");
        uint256 vestedBps = 0;
        for (uint i = 0; i < config.vestingSchedule.vestingBps.length; i++) {
            if (config.vestingSchedule.vestingTimestamps[i] < block.timestamp) {
                vestedBps = config.vestingSchedule.vestingBps[i];
            }
        }

        uint256 allocatedTokens = investmentAmtToTokens(getInvestmentKeyDict(investmentKeyToReceivedFunds, id));
        if (config.vestingSchedule.vestingStrategy == VestingStrategy.PROPORTIONAL) {
            return allocatedTokens * vestedBps / 10000;
        }

        uint256 globalAllocatedTokens = 0;
        for (uint i = 0; i < investmentKeys.length; i++) {
            address keyAddr = investmentKeys[i].addr;
            uint256 keyId = investmentKeys[i].id;
            globalAllocatedTokens += investmentAmtToTokens(investmentKeyToReceivedFunds[keyAddr][keyId]);
        }
        uint256 globalVestedTokens = globalAllocatedTokens * vestedBps / 10000;

        InvestmentKey memory key = getInvestmentKey(id);
        if (config.vestingSchedule.vestingStrategy == VestingStrategy.TIME_INC) {
            for (uint i = 0; i < investmentKeys.length; i++) {
                address keyAddr = investmentKeys[i].addr;
                uint256 keyId = investmentKeys[i].id;
                if (keyAddr == key.addr && keyId == key.id) {
                    return min(globalVestedTokens, allocatedTokens);
                }
                uint256 investorAllocatedTokens = investmentAmtToTokens(investmentKeyToReceivedFunds[keyAddr][keyId]);
                globalVestedTokens -= investorAllocatedTokens;
            }
        }
        return 0;
    }
}

