import React, { useEffect, useState } from "react";
import {useLocalStorage} from "./useLocalStorage"
import {useSessionStorage} from "./useSessionStorage"
import Network from "../DataModels/Network";
import { useMoralis } from "react-moralis";

//2.
export const MakeDealFormContext = React.createContext();

//3.
export const MakeDealFormProvider = ({ children }) => {
    const [step, setStep] = useSessionStorage("makeDealForm.step", 1);
    const [dealName, setDealName] = useSessionStorage("makeDealForm.dealName", "");
    const [nftAddress, setNftAddress] = useSessionStorage("makeDealForm.nftAddress", "");
    const [paymentTokenAddress, setPaymentTokenAddress] = useSessionStorage("makeDealForm.paymentTokenAddress", "");
    const [minRoundSize, setMinRoundSize] = useSessionStorage("makeDealForm.minRoundSize", "");
    const [maxRoundSize, setMaxRoundSize] = useSessionStorage("makeDealForm.maxRoundSize", "");
    const [minInvestPerInvestor, setMinInvestPerInvestor] = useSessionStorage("makeDealForm.minInvestPerInvestor", "");
    const [maxInvestPerInvestor, setMaxInvestPerInvestor] = useSessionStorage("makeDealForm.maxInvestPerInvestor", "");
    const [investDeadline, setInvestDeadline] = useSessionStorage("makeDealForm.investDeadline", undefined);
    const [projectWalletAddress, setProjectWalletAddress] = useSessionStorage("makeDealForm.projectWalletAddress", "");
    const [projectTokenPrice, setProjectTokenPrice] = useSessionStorage("makeDealForm.projectTokenPrice", "");
    const [projectTokenAddress, setProjectTokenAddress] = useSessionStorage("makeDealForm.projectTokenAddress", "");
    const [vestingSchedule, setVestingSchedule] = useSessionStorage("makeDealForm.vestingSchedule", []);
    const [syndicateWalletAddress, setSyndicateWalletAddress] = useSessionStorage("makeDealForm.syndicateWalletAddress", "");
    const [syndicationFeeProject, setSyndicationFeeProject] = useSessionStorage("makeDealForm.syndicationFeeProject", "");
    const [syndicationFeePayment, setSyndicationFeePayment] = useSessionStorage("makeDealForm.syndicationFeePayment", "");

    const incrementStep = () => {
        if (step < 5) {
            setStep(step + 1)
        }
    }

    const decrementStep = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    useEffect(() => {
    }, [])

  return (
    <MakeDealFormContext.Provider value={{ step, 
                                            incrementStep, 
                                            decrementStep, 
                                            dealName, 
                                            setDealName,
                                            nftAddress,
                                            setNftAddress,
                                            paymentTokenAddress,
                                            setPaymentTokenAddress,
                                            minRoundSize,
                                            setMinRoundSize,
                                            maxRoundSize,
                                            setMaxRoundSize,
                                            minInvestPerInvestor,
                                            setMinInvestPerInvestor,
                                            maxInvestPerInvestor,
                                            setMaxInvestPerInvestor,
                                            investDeadline,
                                            setInvestDeadline,
                                            projectWalletAddress,
                                            setProjectWalletAddress,
                                            projectTokenPrice,
                                            setProjectTokenPrice,
                                            projectTokenAddress,
                                            setProjectTokenAddress,
                                            vestingSchedule,
                                            setVestingSchedule,
                                            syndicateWalletAddress,
                                            setSyndicateWalletAddress,
                                            syndicationFeePayment,
                                            setSyndicationFeePayment,
                                            syndicationFeeProject,
                                            setSyndicationFeeProject
                                        }}>
        {children}
    </MakeDealFormContext.Provider>
  );
};