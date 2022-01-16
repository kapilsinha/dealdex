import {ethers, BigNumber, Signer, providers } from 'ethers';
import {BigNumber as BigNumberJS} from "bignumber.js"

class DealConfig {
    participantAddresses: ParticipantAddresses
    exchangeRate: ExchangeRate
    investConfig: InvestConfig
    refundConfig: RefundConfig
    claimTokensConfig: ClaimTokensConfig
    claimFundsConfig: ClaimFundsConfig
    vestingSchedule: VestingSchedule

    constructor(participantAddresses: ParticipantAddresses,
                exchangeRate: ExchangeRate,
                investConfig: InvestConfig,
                refundConfig: RefundConfig,
                claimTokensConfig: ClaimTokensConfig,
                claimFundsConfig: ClaimFundsConfig,
                vestingSchedule: VestingSchedule) {
        this.participantAddresses = participantAddresses
        this.exchangeRate = exchangeRate
        this.investConfig = investConfig
        this.refundConfig = refundConfig
        this.claimTokensConfig = claimTokensConfig
        this.claimFundsConfig = claimFundsConfig
        this.vestingSchedule = vestingSchedule
    }

    toSmartContractInput() {
        return [
            this.participantAddresses.toSmartContractInput(),
            this.exchangeRate.toSmartContractInput(),
            this.investConfig.toSmartContractInput(),
            this.refundConfig.toSmartContractInput(),
            this.claimTokensConfig.toSmartContractInput(),
            this.claimFundsConfig.toSmartContractInput()
        ]
    }

}

class ParticipantAddresses {
    dealDexAddress: string
    managerAddress: string
    projectAddress: string

    constructor(dealDexAddress: string | undefined, managerAddress: string | undefined, projectAddress: string | undefined) {
        this.dealDexAddress = dealDexAddress || ""
        this.managerAddress = managerAddress || ""
        this.projectAddress = projectAddress || ""
    }

    toSmartContractInput() {
        return [this.dealDexAddress, this.managerAddress, this.projectAddress];
    }
}

class ExchangeRate {
    ethPerToken: string
    tickSize: BigNumber // amt of wei per
    tickValue: BigNumber // amt of token bits

    constructor(ethPerToken: string, tokenDecimals: number) {
        this.ethPerToken = ethPerToken;
        [this.tickSize, this.tickValue] = ExchangeRate.getTickSizeAndValue(ethPerToken, tokenDecimals)
    }

    static init(tickSize: BigNumber, tickValue: BigNumber, tokenDecimals: number) {
        let ethPerToken = ExchangeRate.getEthPerToken(tickSize, tickValue, tokenDecimals)

        let exchangeRate = new ExchangeRate(ethPerToken, tokenDecimals)

        return exchangeRate
    }

    static undefined() {
        let exchangeRate = new ExchangeRate("0", 0)
        exchangeRate.tickSize = BigNumber.from("0")
        exchangeRate.tickValue = BigNumber.from("0")
        return exchangeRate
    }

    static getTickSizeAndValue(ethPerToken: string, tokenDecimals: number): [BigNumber, BigNumber] {
        const multiplier = (new BigNumberJS(10)).exponentiatedBy(18 - tokenDecimals)
        const bigEthPerToken = new BigNumberJS(ethPerToken)
    
        const weiPerTokenBits = bigEthPerToken.multipliedBy(multiplier)
    
        let [tickSize, tickValue] = weiPerTokenBits.toFraction()
    
        let bigTickSize = BigNumber.from(tickSize.toString())
        let bigTickValue =  BigNumber.from(tickValue.toString())
    
        return [bigTickSize, bigTickValue]
    }

    static getEthPerToken(tickSize: BigNumber, tickValue: BigNumber, tokenDecimals: number): string {
        const bigTickSize = new BigNumberJS(tickSize.toString())
        const bigTickValue = new BigNumberJS(tickValue.toString())
        const weiPerTokenBits = bigTickSize.dividedBy(bigTickValue)
    
        const multiplier = (new BigNumberJS(10)).exponentiatedBy(tokenDecimals - 18)
    
        const ethPerToken = weiPerTokenBits.multipliedBy(multiplier)
        return ethPerToken.toString()
    }

    toSmartContractInput() {
        return [this.tickSize, this.tickValue]
    }
}

class InvestConfig {
    minWeiPerInvestor: BigNumber
    maxWeiPerInvestor: BigNumber
    minTotalWei: BigNumber
    maxTotalWei: BigNumber
    gateToken: string
    deadline: BigNumber
    investmentTokenAddress: string
    investmentKeyType: string

    constructor(minWeiPerInvestor: BigNumber, 
                maxWeiPerInvestor: BigNumber, 
                minTotalWei: BigNumber, 
                maxTotalWei: BigNumber,
                gateToken: string | undefined,
                deadline: BigNumber,
                investmentTokenAddress: string | undefined,
                investmentKeyType: string | undefined) {
        this.gateToken = gateToken || ethers.constants.AddressZero
        this.minWeiPerInvestor = minWeiPerInvestor
        this.maxWeiPerInvestor = maxWeiPerInvestor
        this.minTotalWei = minTotalWei
        this.maxTotalWei = maxTotalWei
        this.deadline = deadline
        this.investmentTokenAddress = investmentTokenAddress || ""
        this.investmentKeyType = investmentKeyType || ""
    }

    toSmartContractInput() {
        const _investmentSizeConstraints = [
            this.minWeiPerInvestor, 
            this.maxWeiPerInvestor, 
            this.minTotalWei, this.maxTotalWei
        ]

        return [
            this.investmentTokenAddress,
            this.investmentKeyType,
            _investmentSizeConstraints, 
            /* lockConstraint = NO_CONSTRAINT */ 0, 
            /* gateToken */ this.gateToken, 
            this.deadline
        ];
    }
}

class RefundConfig {
    toSmartContractInput() {
        return [/* allowRefunds */ true, /* lockConstraint = REQUIRE_UNLOCKED */ 2];
    }
}

class ClaimTokensConfig {
    startupTokenAddress: string
    dealdexFeeBps: number
    managerFeeBps: number

    constructor(startupTokenAddress: string | undefined, dealdexFeeBps: number | undefined, managerFeeBps: number | undefined) {
        this.startupTokenAddress = startupTokenAddress || ""        
        this.dealdexFeeBps = dealdexFeeBps || 0
        this.managerFeeBps = managerFeeBps || 0
   }

    toSmartContractInput() {
        return [this.startupTokenAddress, this.dealdexFeeBps, this.managerFeeBps, /* lockConstraint = REQUIRE_LOCKED */ 1]
    }
}

class ClaimFundsConfig {
    dealdexFeeBps: number
    managerFeeBps: number

    constructor(dealdexFeeBps: number | undefined, managerFeeBps: number | undefined) {
        this.dealdexFeeBps = dealdexFeeBps || 0
        this.managerFeeBps = managerFeeBps || 0
    }

    toSmartContractInput() {
        return [this.dealdexFeeBps, this.managerFeeBps, /* lockConstraint = REQUIRE_LOCKED */ 1];
    }
}

class VestingSchedule {
    vestingStrategy: String
    vestingBps: number[]
    vestingTimestamps: Date[]

    constructor(vestingStrategy: String | undefined, vestingBps: Array<number> | undefined, vestingTimestamps: Array<Date> | undefined) {
        this.vestingStrategy = vestingStrategy || ""
        this.vestingBps = vestingBps || []
        this.vestingTimestamps = vestingTimestamps || []
    }

    toSmartContractInput() {
        return [this.vestingBps, this.vestingTimestamps, this.vestingStrategy];
    }
}

export {DealConfig, ParticipantAddresses, ExchangeRate, InvestConfig, RefundConfig, ClaimTokensConfig, ClaimFundsConfig, VestingSchedule}