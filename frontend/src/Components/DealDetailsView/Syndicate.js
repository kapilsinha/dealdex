import { useState, useEffect, useContext } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import SummaryRow from "./Components/SummaryRow"
import ProjectCard from "./Components/ProjectCard"
import InvestCard from "./Components/InvestCard"
import VestingScheduleCard from "./Components/VestingScheduleCard";
import FundingAmountCard from "./Components/FundingAmountCard";
import SubscribedInvestorsCard from "./Components/SubscribedInvestorsCard";
import {DealDetailsContext} from "../../Contexts/DealDetailsContext"

function DealDetailsViewProject(props) {
  const {dealMetadata, dealConfig} = useContext(DealDetailsContext)  

  const dealName = dealMetadata ? dealMetadata.getName() : ""
  const managerName = dealMetadata ? dealMetadata.getManager().getName() : ""
  const managerIsVerified = dealMetadata ? dealMetadata.getManager().getVerifiedStatus() : false

  return (
    <Container maxW="container.xl" p={0}>
      <Flex h={{ base: "auto", md: "100%" }} py={[0, 10, 20]} direction={{ base: "column-reverse", md: "row" }}>
        <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
          <VStack w="full" spacing={3} alignItems="center">
            <Heading size="2xl">{dealName}</Heading>
            <HStack>
              <Text fontSize="2xl" color="gray.500">
                {managerName}
              </Text>
              {managerIsVerified&& (
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
