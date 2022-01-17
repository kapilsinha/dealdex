import User from "./User";
import Moralis from "moralis";

export default class DealMetadata extends Moralis.Object {
    // TODO: change to private?
	constructor() {
        super('Deal')
    }

    // TODO: I imagine this is created in the backend and so this can be removed
    static createDeal(
        name: string, 
        project: User,
        manager: User,
        investorPaymentToken: string,
        nftAddress: string,
        minInvestmentAmt: number,
        investmentDeadline: number,
        address: string,
        totalFunds: number): DealMetadata
    {
        let deal = new DealMetadata()
        deal.set("name", name)
        deal.set("project", project)
        deal.set("manager", manager)
        deal.set("investorPaymentToken", investorPaymentToken)
        deal.set("nftAddress", nftAddress)
        deal.set("minInvestmentAmt", minInvestmentAmt)
        deal.set("investmentDeadline", investmentDeadline)
        deal.set("address", address)
        deal.set("totalFunds", totalFunds)
        return deal
    }
}
Moralis.Object.registerSubclass('Deal', DealMetadata)