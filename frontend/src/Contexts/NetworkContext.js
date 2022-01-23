import React, { useEffect, useState } from "react";
import {useLocalStorage} from "./useLocalStorage"
import Network from "../DataModels/Network";
import { useMoralis } from "react-moralis";
import appConfig from "../appConfig.json"
import { useChain } from "react-moralis"
import {useToast } from "@chakra-ui/react";
import { useSessionStorage } from "./useSessionStorage";

//2.
export const NetworkContext = React.createContext();

//3.
export const NetworkProvider = ({ children }) => {

  var networks
  if (appConfig.currentEnvironment == "dev") {
    networks = [
      Network.ethereum(),
      Network.polygon(),
      Network.ropsten(),
      Network.mumbai(),
      Network.localhost()
    ]
  } else if (appConfig.currentEnvironment == "testnet") {
    networks = [
      Network.ropsten(),
      Network.mumbai(),
    ]
  } else if (appConfig.currentEnvironment == "mainnet") {
    networks = [
      Network.ethereum(),
      Network.polygon()
    ]
  }


    const [networkIndex, setNetworkIndex] = useSessionStorage("network", 0);
    const [walletChain, setWalletChain] = useState(null)
    const {switchNetwork, chainId} = useChain()
    const toast = useToast();
    const toastIdRef = React.useRef()

    const {Moralis, isWeb3Enabled, isWeb3EnableLoading, enableWeb3 } = useMoralis()

    const allNetworkNames = networks.map((network) => {return network.name})
    
    const selectedNetworkChainId = networks[networkIndex].chainId
    const selectedNetworkName = networks[networkIndex].name

    function closeCurrentToast() {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current)
      }
    }

    useEffect(() => {
      if (!isWeb3Enabled && !isWeb3EnableLoading) {
        enableWeb3()
      } 
    }, [isWeb3Enabled])

    useEffect(() => {
      async function switchWalletNetwork() {
        if (isWeb3Enabled) {

          if (selectedNetworkChainId != chainId) {
            try {
              switchNetwork(`0x${selectedNetworkChainId.toString(16)}`)
            } catch(err) {
              console.log(err)
            }
            
            closeCurrentToast()
            toastIdRef.current = toast({
              title: "Change your network to " + selectedNetworkName,
              status: "error",
              isClosable: false,
              position: "top",
              duration: null
            })
          } else {
            closeCurrentToast()
          }
          
        }
      }
      switchWalletNetwork()
    }, [networkIndex, chainId, isWeb3Enabled])

  return (
    <NetworkContext.Provider value={{ selectedNetworkName, selectedNetworkChainId, allNetworkNames, setNetworkIndex, walletChain: chainId }}>{children}</NetworkContext.Provider>
  );
};
