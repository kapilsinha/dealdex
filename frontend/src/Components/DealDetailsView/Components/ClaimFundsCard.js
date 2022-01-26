import { useState, useEffect } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import DealDexNumberForm from "../../../ReusableComponents/DealDexNumberForm"

export default function ClaimFundsCard(props) {
    return(
        <Box layerStyle="detailSummaryWrap" w="40%" h="340px" px="20px">
            <Tabs mt={4} >
                <TabList>
                    <Tab>Claim Funds</Tab>
                    <Tab ml={50}>Deposit Tokens</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <ClaimFunds />
                    </TabPanel>
                    <TabPanel>
                        <DepositTokens />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

function ClaimFunds(props) {
    return(
        <VStack mb={5}>
            <HStack pb={3} w="full">
                <Heading size="sm" py="3px" w="full" textAlign="left">
                    Available funds:
                </Heading>
                <Heading size="sm" py="3px" w="full" textAlign="right">
                    {"100"} {"USDC"}
                </Heading>
            </HStack>
            <HStack mt={50} w="full" justify="center">
                <Button variant="dealDetailTable" size="lg">
                    Claim Funds
                </Button>
            </HStack>
        </VStack>
    )
}

function DepositTokens() {
    return(
        <VStack mb={5}>
            <VStack mb={5}>
                <DealDexNumberForm 
                    title="Amount to deposit"
                    colSpan={2}
                    onChange = {value => console.log(value)}
                    value = {0}
                    width="100%"
                    appendChar = {"USDC"}
                    isRequired = {false}
                    disabled = {false}
                    precision = {2}
                    min={0}
                />
            </VStack>
            <HStack mt={30} w="full" justify="center">
                <Button variant="dealDetailTable" size="lg">
                    Deposit Tokens
                </Button>
            </HStack>
        </VStack>
    )
}
