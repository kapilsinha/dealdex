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

    static async fromSmartContractStruct(dealConfigStruct: any, chainId: number) {
        const participantAddresses = ParticipantAddresses.fromSmartContractStruct(dealConfigStruct.participantAddresses)
        console.log(participantAddresses)
        const exchangeRate = await ExchangeRate.fromSmartContractStruct(
            dealConfigStruct.exchangeRate, 
            dealConfigStruct.investConfig,
            dealConfigStruct.tokensConfig,
            chainId
        )

        if (!exchangeRate) {
            return undefined
        }

        const investConfig = InvestConfig.fromSmartContractStruct(dealConfigStruct.investConfig)
        const refundConfig = RefundConfig.fromSmartContractStruct(dealConfigStruct.refundConfig)
        const claimTokensConfig = ClaimTokensConfig.fromSmartContractStruct(dealConfigStruct.tokensConfig)
        const claimFundsConfig = ClaimFundsConfig.fromSmartContractStruct(dealConfigStruct.fundsConfig)
        const vestingSchedule = VestingSchedule.fromSmartContractStruct(dealConfigStruct.vestingSchedule)

        return new DealConfig(
            participantAddresses,
            exchangeRate,
            investConfig,
            refundConfig,
            claimTokensConfig,
            claimFundsConfig,
            vestingSchedule
        )
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

    static fromSmartContractStruct(participantAddressesStruct: any) {
        return new ParticipantAddresses(
            participantAddressesStruct.dealdex, 
            participantAddressesStruct.manager,
            participantAddressesStruct.project
        )
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
        console.log(contractAddress)
        console.log(chainId)
        const tokenMetadata = await SmartContractService.getERC20Metadata(contractAddress, chainId)
        console.log(tokenMetadata)

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
    // paymentToken per project token
    displayValue: string

    projectTokenBits: BigNumber
    paymentTokenBits: BigNumber
    projectToken?: DealToken
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
        this.projectToken = projectToken 
    }

    // Static factory methods

    static fromDisplayValue(paymentTokenPerProjectToken: string, paymentToken: DealToken, projectToken?: DealToken) {
        // If the project token does not exist yet, assume it has the same decimals as payment token
        const projectTokenUnwrapped = projectToken || paymentToken

        const multiplier = (new BigNumberJS(10)).exponentiatedBy(paymentToken.decimals - projectTokenUnwrapped.decimals)

        const paymentBitsPerProjectBits = (new BigNumberJS(paymentTokenPerProjectToken)).multipliedBy(multiplier)

        const [paymentBits, projectBits] = paymentBitsPerProjectBits.toFraction()

        return new ExchangeRate(
            paymentTokenPerProjectToken,
            BigNumber.from(projectBits.toString()),
            BigNumber.from(paymentBits.toString()),
            paymentToken,
            projectToken
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
        const paymentBitsPerProjectBits = paymentBitsJS.dividedBy(projectBitsJS)

        const multiplier = (new BigNumberJS(10)).exponentiatedBy(projectTokenUnwrapped.decimals - paymentToken.decimals)

        const displayValue = paymentBitsPerProjectBits.multipliedBy(multiplier).toString()

        return new ExchangeRate(
            displayValue,
            projectBits,
            paymentBits,
            paymentToken,
            projectToken
        )

    }

    toSmartContractInput() {
        return [this.projectTokenBits, this.paymentTokenBits]
    }

    static async fromSmartContractStruct(exchangeRateStruct: any, investConfigStruct: any, tokensConfigStruct: any, chainId: number) {
        console.log(chainId)
        const paymentToken = await DealToken.fromContractAddress(investConfigStruct.investmentTokenAddress, chainId)
        const projectToken = await DealToken.fromContractAddress(tokensConfigStruct.projectTokenAddress, chainId)

        console.log(paymentToken)
        console.log(projectToken)

        if (!paymentToken) {
            return undefined
        }
        if (!projectToken && tokensConfigStruct.projectTokenAddress != ethers.constants.AddressZero) {
            return undefined
        }

        return ExchangeRate.fromTokenBitFraction(
            exchangeRateStruct.denominator,
            paymentToken,
            exchangeRateStruct.numerator,
            projectToken
        )
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

    static fromSmartContractStruct(investConfigStruct: any) {
        const deadlineUnixTimestamp = investConfigStruct.investmentDeadline.toNumber()
        return new InvestConfig(
            investConfigStruct.sizeConstraints.minInvestmentPerInvestor,
            investConfigStruct.sizeConstraints.maxInvestmentPerInvestor,
            investConfigStruct.sizeConstraints.minTotalInvestment,
            investConfigStruct.sizeConstraints.maxTotalInvestment,
            investConfigStruct.gateToken,
            getDateFromUnixTimestamp(deadlineUnixTimestamp),
            investConfigStruct.investmentTokenAddress,
            investConfigStruct.investmentKeyType

        )
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

    static fromSmartContractStruct(refundConfigStruct: any) {
        return new RefundConfig(refundConfigStruct.allowRefunds)
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

    static fromSmartContractStruct(tokensConfigStruct: any) {
        var projectToken = undefined

        if (tokensConfigStruct.projectTokenAddress != ethers.constants.AddressZero) {
            projectToken = tokensConfigStruct.projectTokenAddress
        }

        return new ClaimTokensConfig(
            tokensConfigStruct.dealdexFeeBps,
            projectToken,
            tokensConfigStruct.managerFeeBps
        )
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

    static fromSmartContractStruct(fundsConfigStruct: any) {
        return new ClaimFundsConfig(
            fundsConfigStruct.dealdexFeeBps,
            fundsConfigStruct.managerFeeBps
        )
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

    static fromSmartContractStruct(vestingScheduleStruct: any) {
        const vestingDates = vestingScheduleStruct.vestingTimestamps.map((timestamp: any) => {
            return getDateFromUnixTimestamp(timestamp.toNumber())
        })
        return new VestingSchedule(
            vestingScheduleStruct.vestingStrategy,
            vestingScheduleStruct.vestingBps,
            vestingDates
        )
    }
}

// Helpers

function getUnixTimestamp(date: Date) {
    const stringTimestamp = Math.round( 
        date.getTime() / 1000
    ).toString()

    return BigNumber.from(stringTimestamp)
}

function getDateFromUnixTimestamp(timestamp: number) {
    return new Date(timestamp * 1000)
}

export {DealConfig, ParticipantAddresses, ExchangeRate, InvestConfig, RefundConfig, ClaimTokensConfig, ClaimFundsConfig, VestingSchedule, DealToken, getUnixTimestamp}