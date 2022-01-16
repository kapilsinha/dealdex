// Import the functions you need from the SDKs you need
import User from "../DataModels/User"
import DealMetadata from "../DataModels/DealMetadata"
import { DealConfig, DealParticipantAddresses } from "../DataModels/DealConfig";
import Moralis from "moralis";

import DeploymentState from "../artifacts/deployment-info/DeploymentState.json"
import moralisConfig from '../moralisConfig.json'

// Moralis
Moralis.start({ serverUrl: moralisConfig.SERVER_URL, appId: moralisConfig.APP_ID });

export default class DatabaseService {

    // TODO: should other classes just use this? or should they import Moralis (and start it) themselves?
    static getMoralis(): Moralis {
        return Moralis;
    }

    static async getDealFactoryAddress(): Promise<string | undefined> {
        const DeploymentState = Moralis.Object.extend("DeploymentState");
        const query = new Moralis.Query(DeploymentState);
        return await query.first().then(function(result) {
            return result === undefined ? undefined : result.get("dealFactoryAddr");
        });
    }

    static async getUser(userAddr: string): Promise<User | undefined> {
        const userQuery = new Moralis.Query(User);
        userQuery.equalTo("address", userAddr);
        return await userQuery.first().then(async function(result) {
            if (result === undefined) {
                const anon = User.anonymous(userAddr);
                return await anon.save().then(
                    (anon) => { return anon; },
                    (error) => { console.log("Unable to create user"); return undefined; }
                );
            }
            return result;
        });
    }

    static async getDealMetadata(dealAddr: string): Promise<DealMetadata | undefined> {
        const dealQuery = new Moralis.Query(DealMetadata);
        dealQuery.equalTo("dealAddr", dealAddr);
        return await dealQuery.first().then(function(result) {
            return result === undefined ? undefined : result;
        });
    }

    static async getAllDealsMetadata(): Promise<DealMetadata[]> {
        const dealQuery = new Moralis.Query(DealMetadata);
        dealQuery.ascending("name");
        return await dealQuery.find()
            .then(function(results) { return results; })
            .catch(function(error) { console.log("Failed to retrieve deals with error: ", error); return []; }
        );
    }

    /*
    TODO: These should be handled in the Moralis backend
    static async recordPendingDeal(dealCreator: User, dealConfig: DealConfig, dealMetadata: DealMetadata, transactionHash: string) {
        // TODO: below needs changing based on the new schema since there is no dealCreatorAddress anymore
        // Not sure why we need a separation between pending deals where startup vs invest
        let dealName = dealMetadata.name

        if (dealConfig.participantAddresses.project === dealCreator.address) {
            return await updateDoc(
                docRef, 
                { [`pendingDealsWhereStartup.${transactionHash}`]: {'name': dealName, 'startupAddress': project}}
            );
        } else {
            return await updateDoc(
                docRef, 
                { [`pendingDealsWhereInvestor.${transactionHash}`]: {'name': dealName, 'startupAddress': project}} 
            );
        }
    }

    static async removePendingDealRecord(txnHash: string) {
        let dealCreator = dealParticipants.dealCreatorAddress
        let project = dealParticipants.projectAddress

        let docRef = await getUserDocRef(dealCreator);

        if (dealCreator == project) {
            return await updateDoc(docRef, { [`pendingDealsWhereStartup.${transactionHash}`]: deleteField()} );
        } else {
            return await updateDoc(docRef, { [`pendingDealsWhereInvestor.${transactionHash}`]: deleteField()} );
        }
    }

    static async recordDeal(dealParticipants: DealParticipantAddresses, dealMetadata: DealMetadata) {
        let dealDocName = "deal_" + dealMetadata.dealAddress!

        let existingDeal = await getFirebaseDoc(dealDocName)

        console.log(dealDocName)
        if (existingDeal !== undefined) {
            console.log("Deal document ", dealDocName, " already exists and updates are not permitted, so we use the existing document");
        }
        else {
            // This returns void
            await writeFirebaseDoc(dealDocName, {"name": dealMetadata.name});
        }

        let dealCreator = dealParticipants.dealCreatorAddress
        let project = dealParticipants.projectAddress

        let creatorDocRef = await getUserDocRef(dealCreator);
        if (dealCreator == project) {
            return await updateDoc(creatorDocRef, { dealsWhereStartup: arrayUnion(dealMetadata.dealAddress!) });
        } else {
            await updateDoc(creatorDocRef, { dealsWhereInvestor: arrayUnion(dealMetadata.dealAddress!) });

            // The project document may not exist yet
            await DatabaseService.getUser(project)
            let startupDocRef = await getUserDocRef(project);
            return await updateDoc(startupDocRef, { dealsWhereStartup: arrayUnion(dealMetadata.dealAddress!) });
        }

    }

    static async recordInvestment(investorAddr: string, dealAddr: string) {
        let dealDocName = "deal_" + dealAddr
        let dealDoc= await getFirebaseDoc(dealAddr);
        if (dealDoc === undefined) {
            console.log("Failed to find the deal document ", dealDocName);
            return;
        }
        
        let docRef = await getUserDocRef(investorAddr);
        return await updateDoc(docRef, { dealsWhereInvestor: arrayUnion(dealAddr) });
    }
    */
}