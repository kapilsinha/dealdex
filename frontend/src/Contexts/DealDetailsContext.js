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
    const {user, isUserUpdating} = useMoralis()

    console.log(dealAddress)

    const [dealMetadata, setDealMetadata] = useState(undefined)
    const [dealConfig, setDealConfig] = useState(undefined)
    const [nftMetadata, setNftMetadata] = useState(undefined)
    const [totalRaised, setTotalRaised] = useState(undefined)
    const [validNfts, setValidNfts] = useState([])
    const [investedNfts, setInvestedNfts] = useState([])
    const [subscribedInvestors, setSubscribedInvestors] = useState(undefined)
    const [dealIsLocked, setDealIsLocked] = useState(undefined)
    const [userIsProject, setUserIsProject] = useState(undefined)
    const [userIsManager, setUserIsManager] = useState(undefined)

    useEffect(() => {
        async function fetchUserData() {
            if (dealMetadata && dealConfig && subscribedInvestors) {
                if (!user) {
                    setUserIsProject(false)
                    setUserIsManager(false)
                    return
                }

                const currentUser = await DatabaseService.getUser(user.get("ethAddress"))

                if (!currentUser) {
                    return
                }

                const isProject = currentUser.getAddress().toLowerCase() == dealMetadata.getProject().getAddress().toLowerCase()
                const isManager = currentUser.getAddress().toLowerCase() == dealMetadata.getManager().getAddress().toLowerCase()
                setUserIsProject(isProject)
                setUserIsManager(isManager)


                

                const nftMap = await currentUser.getNftsForDeal(dealConfig.investConfig.gateToken, selectedNetworkChainId)
                

                const nftsUsedForInvestment = []
                for (const [i, investmentKey] of subscribedInvestors._investmentKeys.entries() ) {
                    const primaryKey = `${investmentKey.addr.toLowerCase()}_${investmentKey.id.toNumber()}`
                    const investedNft = nftMap.get(primaryKey)
                    if (investedNft) {
                        const investment = subscribedInvestors._investments[i]
                        nftsUsedForInvestment.push({investedNft, investment })
                        nftMap.delete(primaryKey)
                    } 
                }
                setValidNfts(Array.from(nftMap.values()))
                setInvestedNfts(nftsUsedForInvestment)

            }
        }
        fetchUserData()
    }, [user, dealMetadata, dealConfig, subscribedInvestors])

    useEffect(() => {
        async function fetchSmartContractData() {
            const isLocked = await SmartContractService.fetchDealIsLocked(dealAddress, selectedNetworkChainId)
            const raised = await SmartContractService.fetchDealTotalInvestmentReceived(dealAddress, selectedNetworkChainId)
            const subscribed = await SmartContractService.fetchSubscribedInvestors(dealAddress, selectedNetworkChainId)
            

            setSubscribedInvestors(subscribed)
            setDealIsLocked(isLocked)
            setTotalRaised(raised)

        }
        async function fetchDeal() {
            const metadata = await DatabaseService.getDealMetadata(dealAddress)
            const dealConfigStruct = await SmartContractService.fetchDealConfig(dealAddress, selectedNetworkChainId) 
            const config = await DealConfig.fromSmartContractStruct(dealConfigStruct, selectedNetworkChainId)
            const gateNft = await SmartContractService.getNFTMetadata(config.investConfig.gateToken, selectedNetworkChainId)
            console.log(gateNft)
            setNftMetadata(gateNft)

            setDealMetadata(metadata)
            setDealConfig(config)
        }
        fetchDeal()
        fetchSmartContractData()

    }, [])

  return (
    <DealDetailsContext.Provider value={{
        dealMetadata, 
        dealConfig, 
        nftMetadata, 
        totalRaised, 
        validNfts, 
        investedNfts, 
        subscribedInvestors, 
        dealIsLocked,
        userIsProject,
        userIsManager
    }}>
        {children}
    </DealDetailsContext.Provider>
  );
};