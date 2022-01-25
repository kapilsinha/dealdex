import React, { useEffect, useState, useContext } from "react";
import {useLocalStorage} from "./useLocalStorage"
import {useSessionStorage} from "./useSessionStorage"
import Network from "../DataModels/Network";
import { useMoralis } from "react-moralis";
import {useLocation, useHistory} from 'react-router-dom'
import DatabaseService from "../Services/DatabaseService"
import SmartContractService from "../Services/SmartContractService"
import {NetworkContext} from "./NetworkContext"
import {DealConfig} from "../DataModels/DealConfig"

//2.
export const DealDetailsContext = React.createContext();

//3.
export const DealDetailsProvider = ({ children }) => {

    const search = useLocation().search
    const dealAddress  = new URLSearchParams(search).get('address')
    const {selectedNetworkChainId} = useContext(NetworkContext)

    console.log(dealAddress)

    const [state, setState] = useState({
        dealMetadata: undefined,
        dealConfig: undefined
    })

    useEffect(() => {
        async function fetchDeal() {
            const dealMetadata = await DatabaseService.getDealMetadata(dealAddress)
            console.log(dealMetadata)

            console.log(selectedNetworkChainId)
            const dealConfigStruct = await SmartContractService.fetchDealConfig(dealAddress, selectedNetworkChainId) 
            console.log(dealConfigStruct)

            const dealConfig = await DealConfig.fromSmartContractStruct(dealConfigStruct, selectedNetworkChainId)
            console.log(dealConfig)

            setState({dealMetadata, dealConfig})
        }
        fetchDeal()

    }, [])

    

  return (
    <DealDetailsContext.Provider value={state}>
        {children}
    </DealDetailsContext.Provider>
  );
};