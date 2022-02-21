import {ethers, Signer} from 'ethers';
import {Deal} from './DealData';
import PendingDeal from './PendingDeal';
import DealFactory from '../artifacts/contracts/PogDeal.sol/DealFactory.json'
import DealService from '../Services/DealService';
import DatabaseService from '../Services/DatabaseService'
import { ParticipantAddresses } from './DealConfig';
import DealMetadata from './DealMetadata';
import SmartContractService from '../Services/SmartContractService';
import Moralis from "../Services/MoralisService";
import NFTMetadata from "./NFTMetadata"


export default class ContactInfo extends Moralis.Object {
    constructor() {
        super("ContactInfo")
    }

    getEmail(): string | null {
        return this.get("email")
    }

    getTelegramUsername(): string | null {
        return this.get("telegramUsername")
    }

    getDiscordUsername(): string | null {
        return this.get("discordUsername")
    }

    getTwitterUsername(): string | null {
        return this.get("twitterUsername")
    }

    static createContactInfo(
        email: string | null = null,
        telegramUsername: string | null = null,
        discordUsername: string | null = null,
        twitterUsername: string | null = null,
       ): ContactInfo
    {
        let contactInfo = new ContactInfo()
        contactInfo.set("email", email)
        contactInfo.set("telegramUsername", telegramUsername)
        contactInfo.set("discordUsername", discordUsername)
        contactInfo.set("twitterUsername", twitterUsername)
        return contactInfo
    }
}

Moralis.Object.registerSubclass('ContactInfo', ContactInfo)
