import React, { useEffect, useState } from "react";
import {useLocalStorage} from "./useLocalStorage"
import Network from "../DataModels/Network";
import { useMoralis } from "react-moralis";

//2.
export const NetworkContext = React.createContext();

//3.
export const NetworkProvider = ({ children }) => {
    const networks = [
        Network.ethereum(),
        Network.mumbai(),
        Network.localhost()
    ]

    const [networkIndex, setNetworkIndex] = useLocalStorage("network", 0);
    const [walletChain, setWalletChain] = useState(null)

    const {Moralis, isWeb3Enabled, isWeb3EnableLoading, enableWeb3 } = useMoralis()

    const allNetworkNames = networks.map((network) => {return network.name})
    
    const selectedNetworkChainId = networks[networkIndex].chainId
    const selectedNetworkName = networks[networkIndex].name

    useEffect(() => {
      async function setCurrentChainId() {
        let chainId = await Moralis.getChainId()
        setWalletChain(chainId)
      }

      if (!isWeb3Enabled && !isWeb3EnableLoading) {
        enableWeb3()
      } else {

        setCurrentChainId()
        const unsubscribe = Moralis.onChainChanged((chain) => {
          setWalletChain(chain)
        })
        return unsubscribe
      }
    }, [isWeb3Enabled])

    useEffect(() => {
      async function switchWalletNetwork() {
        if (isWeb3Enabled) {
          Moralis.switchNetwork(selectedNetworkChainId)
        }
      }
      switchWalletNetwork()
    }, [networkIndex, walletChain, isWeb3Enabled])

  return (
    <NetworkContext.Provider value={{ selectedNetworkName, selectedNetworkChainId, allNetworkNames, setNetworkIndex, walletChain }}>{children}</NetworkContext.Provider>
  );
};
