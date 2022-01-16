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





export default class AuthService {

 

}