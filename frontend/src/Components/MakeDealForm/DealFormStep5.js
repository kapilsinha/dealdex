import { useEffect, useMemo } from "react";

import { useMoralis } from "react-moralis";
import { APP_ID, SERVER_URL } from "../../App";

import { Text, GridItem, VStack, HStack, Button, Box } from "@chakra-ui/react";
import { NFTName, Symbols, ConvertAddress } from "../../Utils/ComponentUtils";

function DealFormStep5(props) {
  const { Moralis } = useMoralis();

  const formatInput = (event) => {
    const attribute = event.target.getAttribute("name");
    this.setState({ [attribute]: event.target.value.trim() });
  };

  const handleNextStep = () => {
    props.nextStep();
  };

  const handlePrevStep = () => {
    props.prevStep();
  };

  useEffect(() => {
    Moralis.start({ serverUrl: SERVER_URL, appId: APP_ID });
  }, []);

  const dealData = useMemo(() => props.dealData, [props.dealData]);

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
            <Box textStyle="textFormStep">{dealData.name}</Box>
          </VStack>
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">PROJECT TOKEN</Box>
            <Box textStyle="textFormStep">{dealData.ethPerToken}</Box>
          </VStack>
        </HStack>
        <HStack w="full" h="full">
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">NFT REQUIREMENT</Box>
            <Box textStyle="textFormStep">
              {" "}
              <NFTName address={dealData.ethNFTPerToken} />
            </Box>
          </VStack>
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">PROJECT TOKEN PRICE</Box>
            <Box textStyle="textFormStep">
              {dealData.tokenPrice} <Symbols address={dealData.tokensInContract} />
            </Box>
          </VStack>
        </HStack>
        <HStack w="full" h="full">
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">ROUND SIZE</Box>
            <Box textStyle="textFormStep">
              {dealData.minRoundSize} <Symbols address={dealData.tokensInContract} /> - {dealData.maxRoundSize} <Symbols address={dealData.tokensInContract} />
            </Box>
          </VStack>
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">SYNDICATE WALLET</Box>
            <Box textStyle="textFormStep">
              <ConvertAddress address={dealData.syndicate} />
            </Box>
          </VStack>
        </HStack>
        <HStack w="full" h="full">
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">LIMIT PER INVESTOR/NFT</Box>
            <Box textStyle="textFormStep">
              {dealData.minRoundSize} <Symbols address={dealData.minInvestment} /> - {dealData.maxInvestment} <Symbols address={dealData.tokensInContract} />
            </Box>
          </VStack>
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">SYNDICATION FEE</Box>
            <Box textStyle="textFormStep">{dealData.syndicateFee} (PSTRD)</Box>
          </VStack>
        </HStack>
        <HStack w="full" h="full">
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">INVESTMENT DEADLINE</Box>
            <Box textStyle="textFormStep">{dealData.investmentDeadline}%</Box>
          </VStack>
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">DEALDEX FEE</Box>
            <Box textStyle="textFormStep">
              {dealData.dealDexFee}% (<Symbols address={dealData.tokensInContract} />)
            </Box>
          </VStack>
        </HStack>
        <HStack w="full" h="full">
          <VStack w="30%" alignItems="flex-start">
            <Box textStyle="labelFormStep">PROJECT WALLET</Box>
            <Box textStyle="textFormStep">
              <ConvertAddress address={dealData.dealAddress} />
            </Box>
          </VStack>
        </HStack>
      </VStack>

      <HStack w="full" h="full" pt={40} spacing={10} alignItems="flex-start">
        <Button variant="dealformBack" size="lg" onClick={handlePrevStep}>
          Back
        </Button>
        <Button variant="dealForm2Details" size="lg" onClick={handleNextStep}>
          Create your deal
        </Button>
      </HStack>
    </GridItem>
  );
}

export default DealFormStep5;
