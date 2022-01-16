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
        txnHash: string): PendingDeal
    {
        let pendingDeal = new PendingDeal()
        pendingDeal.set("name", name)
        pendingDeal.set("creator", creator)
        pendingDeal.set("txnHash", txnHash)
        return pendingDeal
    }
}
Moralis.Object.registerSubclass('PendingDeal', PendingDeal)