import {ethers, BigNumber, Signer, providers } from 'ethers';
import {BigNumber as BigNumberJS} from "bignumber.js"
import SmartContractService from '../Services/SmartContractService';

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

class DealToken {
    name: string
    symbol: string
    decimals: number
    contractAddress: string

    constructor(name: string, symbol: string, decimals: number, contractAddress: string) {
        this.name = name
        this.symbol = symbol
        this.decimals = decimals
        this.contractAddress = contractAddress
    }

    getTokenBits(tokens: string) {
        return ethers.utils.parseUnits(tokens, this.decimals)
    }

    getTokens(tokenBits: BigNumber) {
        return ethers.utils.formatUnits(tokenBits, this.decimals)
    }

    // Static factory methods

    static async fromContractAddress(contractAddress: string, chainId: number) {
        const tokenMetadata = await SmartContractService.getERC20Metadata(contractAddress, chainId)

        if (tokenMetadata) {
            return new DealToken(
                tokenMetadata.name,
                tokenMetadata.symbol,
                tokenMetadata.decimals,
                contractAddress
            )
        } else {
            return undefined
        }
    }

}


class ExchangeRate {
    displayValue: string
    projectTokenBits: BigNumber
    paymentTokenBits: BigNumber
    projectToken: DealToken
    paymentToken: DealToken

    constructor(displayValue: string, 
                projectTokenBits: BigNumber, 
                paymentTokenBits: BigNumber,
                paymentToken: DealToken,
                projectToken?: DealToken) {
        this.displayValue = displayValue
        this.projectTokenBits = projectTokenBits
        this.paymentTokenBits = paymentTokenBits
        this.paymentToken = paymentToken

        // If the project token does not exist yet, assume it has the same decimals as payment token
        this.projectToken = projectToken || paymentToken 
    }

    // Static factory methods

    static fromDisplayValue(projectTokenPerPaymentToken: string, paymentToken: DealToken, projectToken?: DealToken) {
        // If the project token does not exist yet, assume it has the same decimals as payment token
        const projectTokenUnwrapped = projectToken || paymentToken

        const multiplier = (new BigNumberJS(10)).exponentiatedBy(paymentToken.decimals - projectTokenUnwrapped.decimals)

        const projectBitsPerPaymentBits = (new BigNumberJS(projectTokenPerPaymentToken)).multipliedBy(multiplier)

        const [projectBits, paymentBits] = projectBitsPerPaymentBits.toFraction()

        return new ExchangeRate(
            projectTokenPerPaymentToken,
            BigNumber.from(projectBits.toString()),
            BigNumber.from(paymentBits.toString()),
            paymentToken,
            projectTokenUnwrapped
        )
    }

    static fromTokenBitFraction(paymentBits: BigNumber, 
                                paymentToken: DealToken, 
                                projectBits: BigNumber, 
                                projectToken?: DealToken) {
        // If the project token does not exist yet, assume it has the same decimals as payment token
        const projectTokenUnwrapped = projectToken || paymentToken

        const paymentBitsJS = new BigNumberJS(paymentBits.toString())
        const projectBitsJS = new BigNumberJS(projectBits.toString())
        const projectBitsPerPaymentBits = projectBitsJS.dividedBy(paymentBitsJS)

        const multiplier = (new BigNumberJS(10)).exponentiatedBy(projectTokenUnwrapped.decimals - paymentToken.decimals)

        const displayValue = projectBitsPerPaymentBits.multipliedBy(multiplier).toString()

        return new ExchangeRate(
            displayValue,
            projectBits,
            paymentBits,
            paymentToken,
            projectTokenUnwrapped
        )

    }

    toSmartContractInput() {
        return [this.projectTokenBits, this.paymentTokenBits]
    }
}

class InvestConfig {
    minInvestmentPerInvestor: BigNumber
    maxInvestmentPerInvestor: BigNumber
    minTotalInvestment: BigNumber
    maxTotalInvestment: BigNumber
    gateToken: string
    deadline: Date
    investmentTokenAddress: string
    investmentKeyType: number

    constructor(minInvestmentPerInvestor: BigNumber, 
                maxInvestmentPerInvestor: BigNumber, 
                minTotalInvestment: BigNumber, 
                maxTotalInvestment: BigNumber,
                gateToken: string,
                deadline: Date,
                investmentTokenAddress: string,
                investmentKeyType: number) {
        this.gateToken = gateToken
        this.minInvestmentPerInvestor = minInvestmentPerInvestor
        this.maxInvestmentPerInvestor = maxInvestmentPerInvestor
        this.minTotalInvestment = minTotalInvestment
        this.maxTotalInvestment = maxTotalInvestment
        this.deadline = deadline
        this.investmentTokenAddress = investmentTokenAddress
        this.investmentKeyType = investmentKeyType
    }

    toSmartContractInput() {
        const _investmentSizeConstraints = [
            this.minInvestmentPerInvestor, 
            this.maxInvestmentPerInvestor, 
            this.minTotalInvestment, 
            this.maxTotalInvestment
        ]

        const deadlineUnixTimestamp = getUnixTimestamp(this.deadline)

        return [
            _investmentSizeConstraints, 
            /* lockConstraint = NO_CONSTRAINT */ 0, 
            this.investmentTokenAddress,
            /* gateToken */ this.gateToken, 
            this.investmentKeyType,
            deadlineUnixTimestamp
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
    startupTokenAddress?: string
    dealdexFeeBps?: number
    managerFeeBps?: number

    constructor(dealdexFeeBps?: number, startupTokenAddress?: string, managerFeeBps?: number) {
        this.startupTokenAddress = startupTokenAddress   
        this.dealdexFeeBps = dealdexFeeBps
        this.managerFeeBps = managerFeeBps
   }

    toSmartContractInput() {
        const startupTokenAddressInput = this.startupTokenAddress || ethers.constants.AddressZero
        const dealDexFeeInput = this.dealdexFeeBps || 0
        const managerFeeInput = this.managerFeeBps || 0
        return [startupTokenAddressInput, dealDexFeeInput, managerFeeInput, /* lockConstraint = REQUIRE_LOCKED */ 1]
    }
}

class ClaimFundsConfig {
    dealdexFeeBps?: number
    managerFeeBps?: number

    constructor(dealdexFeeBps?: number, managerFeeBps?: number) {
        this.dealdexFeeBps = dealdexFeeBps
        this.managerFeeBps = managerFeeBps
    }

    toSmartContractInput() {
        const dealdexFeeInput = this.dealdexFeeBps || 0
        const managerFeeInput = this.managerFeeBps || 0
        return [this.dealdexFeeBps, this.managerFeeBps, /* lockConstraint = REQUIRE_LOCKED */ 1];
    }
}

class VestingSchedule {
    vestingStrategy: number
    vestingBps: number[]
    vestingDates: Date[]

    constructor(vestingStrategy: number, vestingBps: Array<number>, vestingDates: Array<Date>) {
        this.vestingStrategy = vestingStrategy
        this.vestingBps = vestingBps 
        this.vestingDates = vestingDates
    }

    toSmartContractInput() {
        const vestingTimestamps = this.vestingDates.map(getUnixTimestamp)
        return [this.vestingStrategy, this.vestingBps, vestingTimestamps];
    }
}

// Helpers

function getUnixTimestamp(date: Date) {
    const stringTimestamp = Math.round( 
        date.getTime() / 1000
    ).toString()

    return BigNumber.from(stringTimestamp)
}

export {DealConfig, ParticipantAddresses, ExchangeRate, InvestConfig, RefundConfig, ClaimTokensConfig, ClaimFundsConfig, VestingSchedule, DealToken}