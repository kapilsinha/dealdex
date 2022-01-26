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
    const {user} = useMoralis()

    console.log(dealAddress)

    const [state, setState] = useState({
        dealMetadata: undefined,
        dealConfig: undefined,
        nftMetadata: undefined,
        totalRaised: undefined,
        validNfts: []
    })

    useEffect(() => {
        async function fetchDeal() {

            if (!user) {
                return
            }
            const currentUser = await DatabaseService.getUser(user.get("ethAddress"))

            if (!currentUser) {
                return
            }

            const dealMetadata = await DatabaseService.getDealMetadata(dealAddress)

            const dealConfigStruct = await SmartContractService.fetchDealConfig(dealAddress, selectedNetworkChainId) 
            console.log(dealConfigStruct)

            const dealConfig = await DealConfig.fromSmartContractStruct(dealConfigStruct, selectedNetworkChainId)

            var nftMetadata = undefined
            var totalRaised = undefined
            var validNfts = []
            if(dealConfig) {
                nftMetadata = await SmartContractService.getNFTMetadata(dealConfig.investConfig.gateToken, selectedNetworkChainId)
                totalRaised = await SmartContractService.fetchDealTotalInvestmentReceived(dealAddress, selectedNetworkChainId)
                validNfts = await currentUser.getNftsForDeal(dealConfig.investConfig.gateToken, selectedNetworkChainId)
            }

            setState({dealMetadata, dealConfig, nftMetadata, totalRaised, validNfts})
        }
        fetchDeal()

    }, [user])

    

  return (
    <DealDetailsContext.Provider value={state}>
        {children}
    </DealDetailsContext.Provider>
  );
};