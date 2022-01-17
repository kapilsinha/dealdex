import User from "./User";
import Moralis from "moralis";

export default class PendingDeal extends Moralis.Object {
    // TODO: change to private?
	constructor() {
        super('PendingDeal')
    }

    static createPendingDeal(
        name: string, 
        creator: User, 
        txnHash: string,
        project: User, 
        manager: User,
        investorPaymentToken: string,
        nftAddress: string,
        minInvestmentAmt: number,
        investmentDeadline: number): PendingDeal
    {
        let pendingDeal = new PendingDeal()
        pendingDeal.set("name", name)
        pendingDeal.set("creator", creator)
        pendingDeal.set("txnHash", txnHash)
        pendingDeal.set("project", project)
        pendingDeal.set("manager", manager)
        pendingDeal.set("investorPaymentToken", investorPaymentToken)
        pendingDeal.set("nftAddress", nftAddress)
        pendingDeal.set("minInvestmentAmt", minInvestmentAmt)
        pendingDeal.set("investmentDeadline", investmentDeadline)
        return pendingDeal
    }
}
Moralis.Object.registerSubclass('PendingDeal', PendingDeal)