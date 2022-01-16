export default class DeploymentState {
    deal_addr: string
    dealFactory_addr: string

    constructor(deal_addr: string, dealFactory_addr: string) {
        this.deal_addr = deal_addr
        this.dealFactory_addr = dealFactory_addr
    }

    // TODO: maybe put the below in some interface if more classes share this pattern
    static async fromMoralisDb(moralis: any): Promise<DeploymentState | null> {
        const query = new moralis.Query(moralis.Object.extend("DeploymentState"))
        const results = await query.find()
        if (results.length == 1) {
            let res = results[0]
            return new DeploymentState(res.deal_addr, res.dealFactory_addr)
        }
        return null
    }
}
