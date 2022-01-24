import { useState, useEffect } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";


export default function ClaimFundsCard(props) {
    return(
        <Box layerStyle="detailSummaryWrap" w="40%" h="340px" px="20px">
            <Tabs mt={4} variant="dealDetailProjectTab">
                <TabList>
                <Tab>Claim Funds</Tab>
                <Tab ml={50}>Deposit Tokens</Tab>
                </TabList>
                <TabPanels>
                <TabPanel>
                    <VStack>
                    <VStack spacing={1} w="full" alignItems="flex-start">
                        <Heading size="sm" py="3px" w="full" textAlign="left">
                        Amount
                        </Heading>
                    </VStack>
                    <MakeDealFormNumberItem colSpan={2} onChange={(value) => setDealData({ ...dealData, amount: value })} placeholder="0.0" value={dealData.amount ? dealData.amount : "0.0"} maxvalue={100} parsing={true} appendChar={dealData.nftunit} />
                    </VStack>
                    <HStack pb={3}>
                    <Heading size="sm" py="3px" w="full" textAlign="left">
                        Avaialble funds:
                    </Heading>
                    <Heading size="sm" py="3px" w="full" textAlign="right">
                        {dealData.totalRasied} {dealData.unit}
                    </Heading>
                    </HStack>
                    <HStack mt={50} w="full" justify="center">
                    <Button variant="dealDetailTable" size="lg">
                        Claim Funds
                    </Button>
                    </HStack>
                </TabPanel>
                <TabPanel>
                    <VStack mb={5}>
                    <Select placeholder="Select the token">
                        <option value="option1">Option 1</option>
                    </Select>
                    </VStack>
                    <VStack>
                    <VStack spacing={1} w="full" alignItems="flex-start">
                        <Heading size="sm" py="3px" w="full" textAlign="left">
                        Amount
                        </Heading>
                    </VStack>
                    <MakeDealFormNumberItem colSpan={2} onChange={(value) => setDealData({ ...dealData, amount: value })} placeholder="0.0" value={dealData.amount ? dealData.amount : "0.0"} maxvalue={100} parsing={true} appendChar={dealData.nftunit} />
                    </VStack>
                    <HStack mt={30} w="full" justify="center">
                    <Button variant="dealDetailTable" size="lg">
                        Deposit Tokens
                    </Button>
                    </HStack>
                </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}
