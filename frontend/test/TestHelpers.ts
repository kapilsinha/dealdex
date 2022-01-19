import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import BigNumberJS from "bignumber.js";
import { ERC20, ERC721, Deal, DealFactory, SimpleToken, SimpleNFT } from "../typechain-types"
import {
    ParticipantAddressesStruct,
    ExchangeRateStruct,
    InvestConfigStruct,
    InvestmentSizeConstraintsStruct,
    ClaimRefundConfigStruct,
    ClaimTokensConfigStruct,
    ClaimFundsConfigStruct,
    VestingScheduleStruct,
    DealConfigStruct
} from "../typechain-types/DealFactory"

/*
let Deal = await ethers.getContractFactory("Deal");
let DealFactory = await ethers.getContractFactory("DealFactory");
let SimpleToken = await ethers.getContractFactory("SimpleToken");
*/

/*
async function validateDeal(deal, // Contract, 
                            expectedEthBalance, // BigNumber, 
                            expectedStartupTokenBalance, // BigNumber, 
                            startupToken, // Contract, 
                            tickSize, // BigNumber,
                            tickValue, // BigNumber
                            minInvestment, // BigNumber, 
                            maxInvestment, // BigNumber,
                            startup, //: string,
                            investors, //: string[],
                            expiryDate //: Number
                            ) {
    const prov = ethers.getDefaultProvider();
    
    const decimals = await startupToken.decimals()

    const expectedWeiBalance = ethers.utils.parseEther(expectedEthBalance.toString())
    const expectedStartupTokenBitBalance = ethers.utils.parseUnits(expectedStartupTokenBalance.toString(), decimals)
    expect(await deal.expiryDate()).to.equal(expiryDate);
    expect(await deal.provider.getBalance(deal.address)).to.equal(expectedWeiBalance);
    expect(await startupToken.balanceOf(deal.address)).to.equal(expectedStartupTokenBitBalance);
    expect(await deal.startupToken()).to.equal(startupToken.address);
    const investorsInContract = await deal.getInvestors()
    const investorAddressesInContract = investorsInContract[0]
    expect(investorAddressesInContract.length).to.equal(investors.length);
    
    for (let i = 0; i < investors.length; i++) {
        expect(investorAddressesInContract[i]).to.equal(investors[i]);
    }
    expect(await deal.startup()).to.equal(startup);
}
*/

async function createDeal(
    dealFactory: DealFactory,
    manager: string,
    project: string,
    projectToken: SimpleToken,
    investmentToken: SimpleToken,
    gateToken: SimpleNFT // test these with types ERC20 and ERC721, skipped for now since it's giving me warnings
    ): Promise<Deal | undefined>
{

    let epochSecs = Math.round(new Date().getTime() / 1000);
    let participantAddresses: ParticipantAddressesStruct = {
        dealdex: manager /* gets overwritten */,
        manager: manager,
        project: project,
    }
    let exchangeRate: ExchangeRateStruct = {
        numerator: BigNumber.from(1),
        denominator: BigNumber.from(1000)
    };
    let investSizeConstraint: InvestmentSizeConstraintsStruct = {
        minInvestmentPerInvestor: BigNumber.from(10),
        maxInvestmentPerInvestor: BigNumber.from(100000),
        minTotalInvestment: BigNumber.from(1000),
        maxTotalInvestment: BigNumber.from(100000),
    };
    let investConfig: InvestConfigStruct = {
        sizeConstraints: investSizeConstraint,
        lockConstraint: 2 /* require unlocked */,
        investmentTokenAddress: investmentToken.address,
        gateToken: gateToken.address,
        investmentKeyType: 1 /* gate token */,
        investmentDeadline: epochSecs + 600,
    };
    let refundConfig: ClaimRefundConfigStruct = {
        allowRefunds: true,
        lockConstraint: 2 /* require unlocked */,
    };
    let tokensConfig: ClaimTokensConfigStruct = {
        projectTokenAddress: projectToken.address,
        dealdexFeeBps: 0 /* get overwritten */,
        managerFeeBps: 500,
        lockConstraint: 1 /* require locked */,
    };
    let fundsConfig: ClaimFundsConfigStruct = {
        dealdexFeeBps: 0 /* gets overwritten */,
        managerFeeBps: 250,
        lockConstraint: 0 /* no constraint */,
    };
    let vestingSchedule: VestingScheduleStruct = {
        vestingStrategy: 0 /* proportional */,
        vestingBps: [2500, 8000, 10000],
        vestingTimestamps: [epochSecs, epochSecs + 20, epochSecs + 60],
    }
    let config: DealConfigStruct = {
        participantAddresses: participantAddresses,
        exchangeRate: exchangeRate,
        investConfig: investConfig,
        refundConfig: refundConfig,
        tokensConfig: tokensConfig,
        fundsConfig: fundsConfig,
        vestingSchedule: vestingSchedule,
    };
    
    let Deal = await ethers.getContractFactory("Deal");

    const transaction = await dealFactory.createDeal(config);
    console.log("Waiting for transaction to complete:", transaction)

    const receipt = await transaction.wait()
    for (let eventData of receipt.events!) {
        if (eventData.event == "DealCreated") {
            console.log("Deal address (retrieved from DealCreated event): ", eventData.args![2]);
            let newDeal = await Deal.attach(eventData.args![2]) as Deal;

            console.log("Deal config: ", await newDeal.config());
            return newDeal;
        }
    }
    console.log("Failed to find DealCreated event");
    return undefined;
}

/*
async function createAndValidateDeal(dealFactory, //: Contract, 
                                        startupToken, //: Contract, 
                                        tickSize, //: BigNumber, 
                                        tickValue, //: BigNumber,
                                        minInvestment, //: BigNumber,
                                        maxInvestment, //: BigNumber,
                                        startupAddress, //: string,
                                        expiryDate //: Number
                                        ) {
    let newDeal = await createDeal(
        dealFactory, 
        startupToken, 
        tickSize, 
        tickValue,
        minInvestment,
        maxInvestment,
        startupAddress,
        expiryDate
    )
    
    await validateDeal(
        newDeal, 
        BigNumber.from("0"),
        BigNumber.from("0"),
        startupToken,
        tickValue,
        tickValue,
        minInvestment,
        maxInvestment,
        startupAddress,
        [],
        expiryDate
    )
}

async function sendTokens(deal, //: Contract,
                            startup, //: Signer,
                            startupToken, //: Contract,
                            amount // :BigNumber
                            ) {
    const decimals = await startupToken.decimals()
    const finalAmount = amount.mul(BigNumber.from("10").pow(decimals))
    await startupToken.connect(startup).transfer(deal.address, finalAmount)
}

async function claimProceeds(deal, //: Contract,
                                startup //: Signer
                                ) {
    await deal.connect(startup).claimProceeds()
}
async function invest(deal, //: Contract,
                        investor, //: Signer, 
                        ethToInvest //: BigNumber
                        ) {
    const weiToInvest = ethers.utils.parseEther(ethToInvest.toString()) 
    let overrides = {
        value: weiToInvest 
    };                  
    await deal.connect(investor).invest(overrides)
}
*/

export default {
    //validateDeal: validateDeal,
    createDeal: createDeal,
    // createAndValidateDeal: createAndValidateDeal,
    // sendTokens: sendTokens,
    // claimProceeds: claimProceeds,
    // invest: invest
};
