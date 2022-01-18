import { useEffect, useMemo, useContext, useState} from "react";

import { useMoralis } from "react-moralis";
import { APP_ID, SERVER_URL } from "../../App";

import { Text, GridItem, VStack, HStack, Button, Box } from "@chakra-ui/react";
import { NFTName, Symbols, ConvertAddress } from "../../Utils/ComponentUtils";
import {MakeDealFormContext} from '../../Contexts/MakeDealFormContext'
import {NetworkContext} from '../../Contexts/NetworkContext'
import SmartContractService from '../../Services/SmartContractService'
import DealService from "../../Services/DealService";
import User from '../../DataModels/User';
import Deal from '../../DataModels/DealData';


function DealFormStep5(props) {
  const {user} = useMoralis();

  const {
    decrementStep, 
    dealName, 
    nftAddress,
    paymentTokenAddress,
    minRoundSize,
    maxRoundSize,
    minInvestPerInvestor,
    maxInvestPerInvestor,
    investDeadline,
    projectWalletAddress,
    projectTokenPrice,
    projectTokenAddress,
    vestingSchedule,
    syndicateWalletAddress,
    syndicationFee,
  } = useContext(MakeDealFormContext)
  const {selectedNetworkChainId} = useContext(NetworkContext)

  const [nftMetadata, setNftMetadata] = useState(undefined);
  const [paymentTokenMetadata, setPaymentTokenMetadata] = useState(undefined)
  const [projectTokenMetadata, setProjectTokenMetadata] = useState(undefined)

  const [displayValues, setDisplayValues] = useState({
    dealNameDisplay: "-",
    projectTokenDisplay: "-",
    nftNameDisplay: "-",
    projectTokenPriceDisplay: "-",
    roundSizeDisplay: "-",
    syndicateWalletDisplay: "",
    investorLimitDisplay: "-",
    syndicationFeeDisplay: "-",
    investDeadlineDisplay: "-",
    dealdexFeeDisplay: "-",
    projectWalletDisplay: ""
  })
  const [isLoading, setIsLoading] = useState(true)

  const vestDates = vestingSchedule.filter((vestDate, vestPercent) => Date(vestDate))
  const vestPercents = vestingSchedule.filter((vestDate, vestPercent) => vestPercent)
  const dealData = useState(Deal.empty())

  async function createDeal() {
    dealData.startup = User.createUser(projectWalletAddress, "projectName")
    dealData.name = dealName
    dealData.vestingTimestamps = vestDates
    dealData.vestingBps = vestPercents
    dealData.startupTokenAddress = projectTokenAddress
    dealData.investmentTokenAddress = paymentTokenAddress
    dealData.minTotalInvestment = minRoundSize
    dealData.maxTotalInvestment = maxRoundSize
    dealData.investmentDeadline = Date(investDeadline)
    dealData.tokenPrice = projectTokenPrice
    dealData.managerAddress = syndicateWalletAddress
    dealData.managerFeeBps = syndicationFee

    const userData = User.createUser(user.address, "username")

    await DealService.publishDeal(dealData, userData)
  }
  useEffect(()=>{
    async function initalizeDisplayValues() {
        let payment = await SmartContractService.getERC20Metadata(paymentTokenAddress, selectedNetworkChainId)
        let project = await SmartContractService.getERC20Metadata(projectTokenAddress, selectedNetworkChainId)
        let nft = await SmartContractService.getNFTMetadata(nftAddress, selectedNetworkChainId)


        let display = {
          dealNameDisplay: dealName,
          projectTokenDisplay: project ? project.name : "-",
          nftNameDisplay: nft ? nft.name : "-",
          projectTokenPriceDisplay: payment ? `${projectTokenPrice} ${payment.symbol}`: "-",
          roundSizeDisplay: payment ? `${minRoundSize} ${payment.symbol} - ${maxRoundSize} ${payment.symbol}`: "-",
          syndicateWalletDisplay: syndicateWalletAddress,
          investorLimitDisplay: payment ? `${minInvestPerInvestor} ${payment.symbol} - ${maxInvestPerInvestor} ${payment.symbol}`: "-",
          syndicationFeeDisplay: `${syndicationFee}%`,
          investDeadlineDisplay: (new Date(investDeadline)).toString(),
          dealdexFeeDisplay: payment ? `2.5% ${payment.symbol}`: "-",
          projectWalletDisplay: projectWalletAddress
        }
        setDisplayValues(display)
        setIsLoading(false)
    }        
    initalizeDisplayValues()
  }, []);


  return (
    <GridItem colSpan={2}>
      <VStack w="full" h="full" spacing={10} alignItems="flex-start">
        <VStack spacing={1} alignItems="flex-start">
          <Text variant="dealStepTitle">Review & Submit</Text>
          <Text variant="dealStepDesc">Review the details of your investment deal and deploy your smart contract-powered deal on DealDex.</Text>
        </VStack>
      </VStack>

      <VStack w="full" h="full" pt={9} spacing={10} alignItems="flex-start">
        <HStack w="full" h="full">
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">DEAL NAME</Box>
            <Box textStyle="textFormStep">{displayValues.dealNameDisplay}</Box>
          </VStack>
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">PROJECT TOKEN</Box>
            <Box textStyle="textFormStep">{displayValues.projectTokenDisplay}</Box>
          </VStack>
        </HStack>
        <HStack w="full" h="full">
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">NFT REQUIREMENT</Box>
            <Box textStyle="textFormStep">
              {displayValues.nftNameDisplay}
            </Box>
          </VStack>
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">PROJECT TOKEN PRICE</Box>
            <Box textStyle="textFormStep">
              {displayValues.projectTokenPriceDisplay}
            </Box>
          </VStack>
        </HStack>
        <HStack w="full" h="full">
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">ROUND SIZE</Box>
            <Box textStyle="textFormStep">
              {displayValues.roundSizeDisplay}
            </Box>
          </VStack>
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">SYNDICATE WALLET</Box>
            <Box textStyle="textFormStep">
              <ConvertAddress address={displayValues.syndicateWalletDisplay} />
            </Box>
          </VStack>
        </HStack>
        <HStack w="full" h="full">
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">LIMIT PER INVESTOR/NFT</Box>
            <Box textStyle="textFormStep">
              {displayValues.investorLimitDisplay}
            </Box>
          </VStack>
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">SYNDICATION FEE</Box>
            <Box textStyle="textFormStep">{displayValues.syndicationFeeDisplay}</Box>
          </VStack>
        </HStack>
        <HStack w="full" h="full">
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">INVESTMENT DEADLINE</Box>
            <Box textStyle="textFormStep">{displayValues.investDeadlineDisplay}</Box>
          </VStack>
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">DEALDEX FEE</Box>
            <Box textStyle="textFormStep">
              {displayValues.dealdexFeeDisplay} 
            </Box>
          </VStack>
        </HStack>
        <HStack w="full" h="full">
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">PROJECT WALLET</Box>
            <Box textStyle="textFormStep">
              <ConvertAddress address={displayValues.projectWalletDisplay} />
            </Box>
          </VStack>
        </HStack>
      </VStack>

      <HStack w="full" h="full" pt={40} spacing={10} alignItems="flex-start">
        <Button variant="dealformBack" size="lg" onClick={decrementStep}>
          Back
        </Button>
        <Button variant="dealForm2Details" size="lg" onClick={createDeal} isDisabled={isLoading}>
          Create your deal
        </Button>
      </HStack>
    </GridItem>
  );
}

export default DealFormStep5;
