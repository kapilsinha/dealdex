import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Flex, Container } from "@chakra-ui/react";
import { Button, VStack, Box, Wrap, WrapItem, Table, Thead, Tbody, Tr, Th, Td, Badge } from "@chakra-ui/react";
import { ReactComponent as Logo } from "../assets/icon/DealDexLogo.svg";
import { TimeDeadline, RoundNumbers , Symbols} from '../Utils/ComponentUtils'
import DealService from "../Services/DealService";
import DatabaseService from "../Services/DatabaseService"
import DealCard from "../ReusableComponents/DealCard"

const DummyData = [
  {
    dealName: "Postered Series A",
    syndicateAddress: "MoonBoots Capital",
    isVerified: true,
    requiredNFT: "BAYC",
    minInvestmentAmount: 10,
    address: "0x4ea4e3621adb7051666958c6afe54f6db1a37d83",
    deadline: 1664879311,
  },
  {
    dealName: "Project Series B",
    syndicateAddress: "Web3 Capital",
    isVerified: false,
    requiredNFT: "BAYC",
    minInvestmentAmount: 10000,
    address: "0x4ea4e3621adb7051666958c6afe54f6db1a37d83",
    deadline: 1641228522,
  },
];

const HomeView = () => {

  const history = useHistory()
  const [deals, setDeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  
  function onCreateADeal() {
    history.push("/createDeal")
  }

  useEffect(() => {
    async function fetchDeals() {
  
      const allDeals = await DatabaseService.getAllDealsMetadata()
  
      setDeals(allDeals)
      setIsLoading(false)
    }
    fetchDeals()

  }, []);

  

  return (
    <Container maxW="container.xl" p={0}>
      <Flex h={{ base: "auto", md: "100%" }} py={[0, 10, 20]} direction={{ base: "column-reverse", md: "row" }}>
        <VStack w="full" h="full" p={0} spacing={95} alignItems="center">
          <VStack w="800px" h="full" alignItems="center">
            <Logo />
            <Box textStyle="title" pb={18}>
              DealDex
            </Box>
            <Box textStyle="subtitle" pb={29}>
              Instantly turn your NFT collection into a syndicate. Our platform lets you create NFT-gated investment deals with the click of a button.
            </Box>
            <Button variant="dealCreate" size='lg' onClick={onCreateADeal}>
              Create a deal
            </Button>
          </VStack>
          <VStack w="full" h="full" alignItems="flex-start">
            <Box textStyle="titleSection" pb={25}>
              All Deals
            </Box>
            <ListDeals deals={deals} isLoading={isLoading} />
          </VStack>
        </VStack>
      </Flex>
    </Container>
  );
};

export default HomeView;

const ListDeals = ({ deals = [], isLoading = true }) => {
  if (!deals.length && !isLoading) {
    return <Box textStyle="titleDeal">No deals so far</Box>;
  }

  return (
    <Wrap spacing="45px">
      {deals.map((item, index) => (
        <WrapItem key={index}>
          <DealCard dealMetadata={item}/>
        </WrapItem>
      ))}
    </Wrap>
  );
};
