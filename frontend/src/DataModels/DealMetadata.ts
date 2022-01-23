import NetworkUser from "./User";
import Moralis from "../Services/MoralisService";

export default class DealMetadata extends Moralis.Object {
    // TODO: change to private?
	constructor() {
        super('Deal')
    }

    isPending(): boolean {
        return false
    }

    getName(): string {
        return this.get("name")
    }

    getProject(): NetworkUser {
        return this.get("project")
    }

    getManager(): NetworkUser {
        return this.get("manager")
    }

    getInvestorPaymentToken(): string {
        return this.get("investorPaymentToken")
    }

    getNftAddress(): string {
        return this.get("nftAddress")
    }

    getMinInvestmentAmt(): number {
        return this.get("minInvestmentAmt")
    }

    getInvestmentDeadline(): number {
        return this.get("investmentDeadline")
    }

    getAddress(): string {
        return this.get("address")
    }

    // TODO: I imagine this is created in the backend and so this can be removed
    static createDeal(
        name: string, 
        project: NetworkUser,
        manager: NetworkUser,
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