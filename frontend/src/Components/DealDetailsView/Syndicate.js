import { useState, useEffect } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import StepPercent from "./Components/step-percent";
import ProgressPercent from "./Components/progress-percent";
import {useLocation, useHistory} from 'react-router-dom'

import { ReactComponent as IconArrowRightUpLine } from "../../assets/icon/ArrowRightUpLine.svg";
import MyInvestment from './Components/my-investment';

import { RoundNumbers } from "../../Utils/ComponentUtils";
import DatabaseService from "../../Services/DatabaseService";
import SummaryRow from "./Components/SummaryRow"
import ProjectCard from "./Components/ProjectCard"
import InvestCard from "./Components/InvestCard"
import VestingScheduleCard from "./Components/VestingScheduleCard";
import FundingAmountCard from "./Components/FundingAmountCard";
import SubscribedInvestorsCard from "./Components/SubscribedInvestorsCard";

const DummyData = {
  ethPerToken: "Postered Coin (PSTRD)",
  tokenPrice: "5200.50",
  nftunit: "USDC",
  unit: "USDC",
  minRound: "1500",
  maxRound: "12000",
  amtRasied: "10000",
  totalRasied: "1,200,000",
  nftName: "BAYC",
  verified: true,
  nftTokenArray: ["0xdf7952b35f24acf7fc0487d01c8d5690a60dba07", "0xdf7952b35f24acf7fc0487d01c8d5690a60dba07", "0xdf7952b35f24acf7fc0487d01c8d5690a60dba07", "0xdf7952b35f24acf7fc0487d01c8d5690a60dba07"],
  nextInvesting: "May 3, 2022 07:14:31",
  myInvest: "500.50",
  subscribedInvestor:[{ name: "Investor 1", investment: 1000},{ name: "Pseudonym", investment: 500}]
};

function DealDetailsViewProject(props) {
  const [dealData, setDealData] = useState(DummyData);

  const search = useLocation().search
  const dealAddress  = new URLSearchParams(search).get('address')

  

  useEffect(() => { 
    //fetchDeal(); 
    async function fetchDeal() {
      const dealMetadata = await DatabaseService.getDealMetadata(dealAddress)
      console.log(dealMetadata)
    }
    fetchDeal()
  }, []);

  return (
    <Container maxW="container.xl" p={0}>
      <Flex h={{ base: "auto", md: "100%" }} py={[0, 10, 20]} direction={{ base: "column-reverse", md: "row" }}>
        <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
          <VStack w="full" spacing={3} alignItems="center">
            <Heading size="2xl">Postered Series A</Heading>
            <HStack>
              <Text fontSize="2xl" color="gray.500">
                MoonBoots Capital
              </Text>
              {dealData && dealData.verified && (
                <Box ml={2}>
                  <Badge variant="verified2">VERIFIED</Badge>
                </Box>
              )}
            </HStack>
          </VStack>
          <VStack w="full" spacing={3} alignItems="flex-start">
            <Heading size="xl">Summary</Heading>
            <SummaryRow />
          </VStack>
          <VStack w="full" spacing={3} alignItems="flex-start">
            <HStack w="full" py="10px" spacing={5}>
              <ProjectCard />
              <InvestCard />
            </HStack>
          </VStack>
          <VStack w="full" spacing={3} alignItems="flex-start" pb="16px">
            <Heading size="xl">Other information</Heading>
            <HStack w="full" py="10px" spacing={5}>
              <VestingScheduleCard />
              <FundingAmountCard />
            </HStack>
          </VStack>
          <VStack w="full" spacing={3} alignItems="flex-start">
            <HStack w="full" py="10px" spacing={5}>
              <SubscribedInvestorsCard />
            </HStack>
          </VStack>
        </VStack>
      </Flex>
    </Container>
  );
}

export default DealDetailsViewProject;
