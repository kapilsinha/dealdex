// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebaseConfig.json";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, collection, getDocs, deleteField, DocumentData } from "firebase/firestore";
import User from "../DataModels/User"
import DealMetadata from "../DataModels/DealMetadata"


import DeploymentState from "../artifacts/deployment-info/DeploymentState.json"
import { DealConfig, ParticipantAddresses } from "../DataModels/DealConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firestore
const db = getFirestore(app);


export default class DatabaseService {

    static async getDealFactoryAddress(): Promise<string | undefined> {
        return "metadata"
    }

    static async getUser(userAddr: string): Promise<User | undefined> {
        return User.empty()
    }

    static async getDealMetadata(dealAddr: string): Promise<DealMetadata | undefined> {
        return undefined
    }

    static async getAllDealsMetadata(): Promise<DealMetadata[]> {
        return []
    }

    static async recordPendingDeal(dealConfig: DealConfig, dealMetadata: DealMetadata, transactionHash: string) {
        return
    }

    static async removePendingDealRecord(dealParticipants: ParticipantAddresses, transactionHash: string) {
        return
    }

    static async recordDeal(dealParticipants: ParticipantAddresses, dealMetadata: DealMetadata) {
        return

    }

    static async recordInvestment(investorAddr: string, dealAddr: string) {
        return
    }
}
