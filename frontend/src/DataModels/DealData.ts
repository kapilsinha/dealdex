import NetworkUser from './User';


class Deal {
    name?: string
    dealAddress?: string
    startup: NetworkUser
    investors: NetworkUser[]
    investorAmounts: string[]
    ethPerToken?: string
    startupTokenAddress?: string
    minInvestmentPerInvestor?: string
    maxInvestmentPerInvestor?: string
    minTotalInvestment?: string
    maxTotalInvestment?: string
    investmentDeadline?: Date
    tokensInContract?: string
    ethInContract?: string
    gateToken?: string
    tokenPrice?: number
    vestPercent?: number
    dealdexFeeBps?: number
    managerFeeBps?: number
    vestingStrategy: number // should be an enum corresponding to the VestingStrategy in DealConfig.sol
    vestingBps?: number[]
    vestingTimestamps?: Date[]
    investmentTokenAddress?: string
    investmentKeyType: number // should be an enum corresponding to the InvestmentKeyType in InvestmentKey.sol
    dealdexAddress?: string
    managerAddress?: string

    constructor(startup: NetworkUser, 
                investors: NetworkUser[], 
                investorAmounts: string[],
                vestingStrategy: number,
                investmentKeyType: number,
                name?: string, 
                dealAddress?: string,
                ethPerToken?: string,
                startupTokenAddress?: string, 
                minInvestmentPerInvestor?: string,
                maxInvestmentPerInvestor?: string,
                minTotalInvestment?: string,
                maxTotalInvestment?: string,
                investmentDeadline?: Date,
                tokensInContract?: string,
                ethInContract?: string,
                gateToken?: string,
                tokenPrice?: number,
                vestPercent?: number,
                dealdexFeeBps?: number,
                managerFeeBps?: number,
                vestingBps?: number[],
                vestingTimestamps?: Date[],
                investmentTokenAddress?: string,
                dealdexAddress?: string,
                managerAddress?: string) {
        this.name = name
        this.dealAddress = dealAddress
        this.startup = startup
        this.investors = investors
        this.investorAmounts = investorAmounts
        this.ethPerToken = ethPerToken
        this.startupTokenAddress = startupTokenAddress
        this.minInvestmentPerInvestor = minInvestmentPerInvestor
        this.maxInvestmentPerInvestor = maxInvestmentPerInvestor
        this.minTotalInvestment = minTotalInvestment
        this.maxTotalInvestment = maxTotalInvestment
        this.investmentDeadline = investmentDeadline
        this.tokensInContract = tokensInContract
        this.ethInContract = ethInContract
        this.gateToken = gateToken
        this.tokenPrice = tokenPrice
        this.vestPercent = vestPercent
        this.dealdexFeeBps = dealdexFeeBps
        this.managerFeeBps = managerFeeBps
        this.vestingStrategy = vestingStrategy
        this.vestingBps = vestingBps
        this.vestingTimestamps = vestingTimestamps
        this.investmentTokenAddress = investmentTokenAddress
        this.investmentKeyType = investmentKeyType
        this.dealdexAddress = dealdexAddress
        this.managerAddress = managerAddress
    }

    static empty() {
        // Default such that for an empty deal, the vesting strategy is 
        // PROPORTIONAL, meaning each investor gets x% of her tokens investment,
        // and the investment key type is GATE_TOKEN, meaning that only the 
        // owner of the gate token that the investor owned can withdraw funds
        return new Deal(NetworkUser.empty(), [], [], 0, 1)
    }
}

export {Deal}