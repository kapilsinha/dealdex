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
            this.claimFundsConfig.toSmartContractInput(),
            this.vestingSchedule.toSmartContractInput()
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
    valuePerToken: string
    // ExchangeRate is the number of projectTokenBits per investmentTokenBit
    numerator: BigNumber
    denominator: BigNumber

    constructor(valuePerToken: string, tokenDecimals: number) {
        this.valuePerToken = valuePerToken;
        [this.numerator, this.denominator] = ExchangeRate.getTickSizeAndValue(valuePerToken, tokenDecimals)
    }

    static init(tickSize: BigNumber, tickValue: BigNumber, tokenDecimals: number) {
        let valuePerToken = ExchangeRate.getValuePerToken(tickSize, tickValue, tokenDecimals)

        let exchangeRate = new ExchangeRate(valuePerToken, tokenDecimals)

        return exchangeRate
    }

    static undefined() {
        let exchangeRate = new ExchangeRate("0", 0)
        exchangeRate.numerator = BigNumber.from("0")
        exchangeRate.denominator = BigNumber.from("1")
        return exchangeRate
    }

    static getTickSizeAndValue(valuePerToken: string, tokenDecimals: number): [BigNumber, BigNumber] {
        const multiplier = (new BigNumberJS(10)).exponentiatedBy(18 - tokenDecimals)
        const bigValuePerToken = new BigNumberJS(valuePerToken)
    
        const weiPerTokenBits = bigValuePerToken.multipliedBy(multiplier)
    
        let [tickSize, tickValue] = weiPerTokenBits.toFraction()
    
        let bigTickSize = BigNumber.from(tickSize.toString())
        let bigTickValue =  BigNumber.from(tickValue.toString())
    
        return [bigTickSize, bigTickValue]
    }

    static getValuePerToken(numerator: BigNumber, denominator: BigNumber, tokenDecimals: number): string {
        const bigTickSize = new BigNumberJS(numerator.toString())
        const bigTickValue = new BigNumberJS(denominator.toString())
        const weiPerTokenBits = bigTickSize.dividedBy(bigTickValue)
    
        const multiplier = (new BigNumberJS(10)).exponentiatedBy(tokenDecimals - 18)
    
        const valuePerToken = weiPerTokenBits.multipliedBy(multiplier)
        return valuePerToken.toString()
    }

    toSmartContractInput() {
        return [this.numerator, this.denominator]
    }
}

class InvestConfig {
    minInvestmentPerInvestor: BigNumber
    maxInvestmentPerInvestor: BigNumber
    minTotalInvestment: BigNumber
    maxTotalInvestment: BigNumber
    gateToken: string
    deadline: BigNumber
    investmentTokenAddress: string
    investmentKeyType: number

    constructor(minInvestmentPerInvestor: BigNumber, 
                maxInvestmentPerInvestor: BigNumber, 
                minTotalInvestment: BigNumber, 
                maxTotalInvestment: BigNumber,
                gateToken: string | undefined,
                deadline: BigNumber,
                investmentTokenAddress: string | undefined,
                investmentKeyType: number) {
        this.gateToken = gateToken || ethers.constants.AddressZero
        this.minInvestmentPerInvestor = minInvestmentPerInvestor
        this.maxInvestmentPerInvestor = maxInvestmentPerInvestor
        this.minTotalInvestment = minTotalInvestment
        this.maxTotalInvestment = maxTotalInvestment
        this.deadline = deadline
        this.investmentTokenAddress = investmentTokenAddress || ""
        this.investmentKeyType = investmentKeyType
    }

    toSmartContractInput() {
        const _investmentSizeConstraints = [
            this.minInvestmentPerInvestor, 
            this.maxInvestmentPerInvestor, 
            this.minTotalInvestment, 
            this.maxTotalInvestment
        ]

        return [
            _investmentSizeConstraints, 
            /* lockConstraint = NO_CONSTRAINT */ 0, 
            this.investmentTokenAddress,
            /* gateToken */ this.gateToken, 
            this.investmentKeyType,
            this.deadline
        ];
    }
}

class RefundConfig {
    allowRefunds: boolean

    constructor(allowRefunds: boolean) {
        this.allowRefunds = allowRefunds
    }

    toSmartContractInput() {
        return [/* allowRefunds */ this.allowRefunds, /* lockConstraint = REQUIRE_UNLOCKED */ 2];
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
    vestingStrategy: number
    vestingBps: number[]
    vestingTimestamps: Date[]

    constructor(vestingStrategy: number, vestingBps: Array<number> | undefined, vestingTimestamps: Array<Date> | undefined) {
        this.vestingStrategy = vestingStrategy
        this.vestingBps = vestingBps || []
        this.vestingTimestamps = vestingTimestamps || []
    }

    toSmartContractInput() {
        return [this.vestingStrategy, this.vestingBps, this.vestingTimestamps];
    }
}

export {DealConfig, ParticipantAddresses, ExchangeRate, InvestConfig, RefundConfig, ClaimTokensConfig, ClaimFundsConfig, VestingSchedule}