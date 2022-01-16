
export default class Network {
    name: string
    chainId: number

    constructor(chainId: number, name: string) {
        this.chainId = chainId
        this.name = name
    }
}