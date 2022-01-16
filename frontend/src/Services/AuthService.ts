// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebaseConfig.json";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import {ethers} from 'ethers';
import { useMoralis, MoralisContextValue } from "react-moralis";
import User from "../DataModels/User"
import Moralis from "moralis"
import Network from "../DataModels/Network"



import moralisConfig from '../moralisConfig.json'

const APP_ID = moralisConfig.APP_ID;
const SERVER_URL = moralisConfig.SERVER_URL;

const SIGN_MESSAGE = "Sign in to DealDex"


export default class AuthService {

    static async login(moralisContext: MoralisContextValue) {
        const {Moralis} = moralisContext

        const user = await (Moralis as any).authenticate({ signingMessage: SIGN_MESSAGE })
    }

    static async getCurrentUser(moralisContext: MoralisContextValue) {
        const {Moralis} = moralisContext
        
        const currentUser = Moralis.User.current()

        if (currentUser) {
            const address = currentUser.get('ethAddress')
            return new User(address, "anonymous", [], [], [], [])
        } else {
            return null
        }
    }

    static async switchNetwork(moralisContext: MoralisContextValue, toNetwork: Network) { 
        const {Moralis} = moralisContext

        let m = (Moralis as any)
        m.enableWeb3()

        await (Moralis as any).switchNetwork(toNetwork.chainId)
    }

    static observeWalletChain(moralisContext: MoralisContextValue, callback: (chain: string)=>void) {
        const {Moralis} = moralisContext

        let m = (Moralis as any)
        m.enableWeb3()

        const unsubscribe = (Moralis as any).onChainChanged(callback)

        return unsubscribe

    }

    static async getWalletChain(moralisContext: MoralisContextValue) {
        const {Moralis} = moralisContext

        let m = (Moralis as any)
        m.enableWeb3()

        const chainId = await (Moralis as any).getChainId()
        return (chainId as Number)
    }
    
    static async logout(moralisContext: MoralisContextValue) {
        const {Moralis} = moralisContext

        await Moralis.User.logOut()
    }

    static async initializeMoralis(moralisContext: MoralisContextValue) {
        const {Moralis} = moralisContext

        Moralis.start({ serverUrl: SERVER_URL, appId: APP_ID })

        let m = (Moralis as any)
        await m.enableWeb3()
    }


}