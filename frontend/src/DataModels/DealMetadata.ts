import User from "./User";
import Moralis from "moralis";

export default class DealMetadata extends Moralis.Object {
    // TODO: change to private?
	constructor() {
        super('Deal')
    }

    static createDeal(
        name: string, 
        address: string,
        manager: User,
        investorPaymentToken: string,
        nftAddress: string,
        status: string,
        fundsRaised: number,
        minInvestmentAmt: number,
        investmentDeadline: number): DealMetadata
    {
        let deal = new DealMetadata()
        deal.set("name", name)
        deal.set("address", address)
        deal.set("manager", manager)
        deal.set("investorPaymentToken", investorPaymentToken)
        deal.set("nftAddress", nftAddress)
        deal.set("status", status)
        deal.set("fundsRaised", fundsRaised)
        deal.set("minInvestmentAmt", minInvestmentAmt)
        deal.set("investmentDeadline", investmentDeadline)
        return deal
    }
}
Moralis.Object.registerSubclass('Deal', DealMetadata)