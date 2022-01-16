import React, { useEffect, useState } from "react";
import {useLocalStorage} from "./useLocalStorage"
import Network from "../DataModels/Network";

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
    const allNetworkNames = networks.map((network) => {return network.name})
    
    const selectedNetworkChainId = networks[networkIndex].chainId
    const selectedNetworkName = networks[networkIndex].name

    console.log(selectedNetworkName)

  return (
    <NetworkContext.Provider value={{ selectedNetworkName, selectedNetworkChainId, allNetworkNames, setNetworkIndex }}>{children}</NetworkContext.Provider>
  );
};