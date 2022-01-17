import {
    GridItem,
    VStack,
    HStack,
    Text,
    Button
  } from '@chakra-ui/react';
import {MakeDealFormItem, MakeDealFormNumberItem} from './index'
import {useEffect, useState, useContext} from 'react';
import {MakeDealFormContext} from '../../Contexts/MakeDealFormContext'
import SmartContractService from '../../Services/SmartContractService';

function DealFormStep4(props) {

  const {
    decrementStep, 
    incrementStep, 
    paymentTokenAddress,
    syndicateWalletAddress,
    setSyndicateWalletAddress,
    syndicationFee,
    setSyndicationFee
  } = useContext(MakeDealFormContext)

  function inputsAreValid() {
    return (syndicateWalletAddress == "" && syndicationFee == "" 
      || getValidatedAddress(syndicateWalletAddress) && syndicationFee != "")
  } 

  
  function getValidatedAddress(address) {
      return SmartContractService.getChecksumAddress(address)
  }

    return (
      <GridItem colSpan={2} >
        <VStack w="65%" h="full" spacing={10} alignItems="flex-start">
            <VStack spacing={1} alignItems="flex-start">
                <Text variant="dealStepTitle">Fees</Text>
                <Text variant="dealStepDesc">Customize your optional syndication fee, payable in the project’s token. Syndication fees will be paid to you when the project deposits its tokens in the deal. Note that DealDex charges a 2.5% fee in the investors’ payment token when the project withdraws funds from the deal.</Text>
            </VStack>
        </VStack>
        <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">
            <MakeDealFormItem 
                title="Syndicate wallet"
                colSpan={2}
                onChange= {e => {
                  let validatedAddress = getValidatedAddress(e.target.value)
                  if (validatedAddress) {
                    setSyndicateWalletAddress(validatedAddress)
                  } else {
                    setSyndicateWalletAddress(e.target.value)
                  }
                }}
                placeholder="Syndicate Wallet Address"
                value={syndicateWalletAddress}
                isRequired= {false}
                verified = {getValidatedAddress(syndicateWalletAddress)}
                helperText="This wallet will receive fees when the project’s tokens are deposited in the deal."
                errorText = "Please enter a valid wallet address"
            />
        </HStack>
        <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">
        <MakeDealFormNumberItem 
            title="Syndication Fee"
            colSpan={2}
            onChange = {value => setSyndicationFee(value)}
            placeholder = "0.0"
            value = {syndicationFee}
            width="50%"
            maxvalue={100}
            appendChar = "%"
            disabled = {!getValidatedAddress(syndicateWalletAddress)}
            helperText = "Percentage of the project token you will receive"
        />
        </HStack>
        <HStack w="full" h="full" pt={40} spacing={10} alignItems="flex-start">
        <Button variant="dealformBack" size="lg" onClick={decrementStep}>
          Back
        </Button>
        <Button variant="dealForm2Details" size="lg" onClick={incrementStep} isDisabled={!inputsAreValid()} >
          Continue to review & submit
        </Button>
      </HStack>
      </GridItem>
    )
}

export default DealFormStep4;