
export default class Network {
    chainId: number
    name: string
    
    constructor(chainId: number, name: string) {
        this.chainId = chainId
        this.name = name
    }

    isEqualTo(network: Network) {
        return this.chainId == network.chainId
    }

    // Static factory methods

    static ethereum() {
        return new Network(1, "Ethereum")
    }

    static mumbai() {
        return new Network(80001, "Mumbai")
    }

    static ropsten() {
        return new Network(3, "Ropsten")
    }

    static polygon() {
        return new Network(137, "Polygon")
    }

    static localhost() {
        return new Network(1337, "Localhost")
    }
}