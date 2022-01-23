import React, { useEffect, useMemo, useContext, useState } from "react";

import { Flex, Box, VStack, Wrap, WrapItem, Table, Thead, Tbody, Tr, Th, Td, Badge } from "@chakra-ui/react";

import { TimeDeadline, RoundNumbers, Symbols, NFTName } from "../../Utils/ComponentUtils";

import { APP_ID, SERVER_URL } from "../../App";
import { useMoralis } from "react-moralis";
import DatabaseService from "../../Services/DatabaseService";
import SmartContractService from "../../Services/SmartContractService";
import {NetworkContext} from "../../Contexts/NetworkContext"
import {DealToken} from "../../DataModels/DealConfig"
import DealCard from "../../ReusableComponents/DealCard"

export default function FundraisingDeals() {
  const { Moralis, user } = useMoralis();

  const {selectedNetworkChainId} = useContext(NetworkContext)

  const [deals, setDeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  async function fetchDeals() {
    if (!user) {
      return
    }
    const currUser = await DatabaseService.getUser(user.get("ethAddress"))

    const dealsWhereProject = await currUser.getDealsWhereProject()

    setDeals(dealsWhereProject)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDeals()

  }, [user]);

  return (
    <VStack w="full" h="full" p={0} alignItems="flex-start">
      <Flex>
        <Box textStyle="investmentMessages" mb={3} mr={2}>
          Your wallet is receiving funding from the following deals
        </Box>
      </Flex>
      <ListDeals deals={deals} isLoading={isLoading} />
    </VStack>
  );
};

const ListDeals = ({ deals = [], isLoading = true }) => {
  if (!deals.length && !isLoading) {
    return <Box textStyle="titleDeal">No fundraising deals yet</Box>;
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
