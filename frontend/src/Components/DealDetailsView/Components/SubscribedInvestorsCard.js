import { useState, useEffect } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";


export default function SubscribedInvestorsCard(props) {

    return(
        <Box layerStyle="detailSummaryWrap" w="full" h="full" px="40px">
            <Heading size="md" py="3px">
                Subscribed Investors
            </Heading>
            <Box layerStyle="detailSummaryWrap" w="100%" my="20px">
                <Table variant="dealDetailProjectTable" size="md">
                <Thead>
                    <Tr>
                    <Th>Name</Th>
                    <Th textAlign={"right"}>Investment</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {/* { dealData.subscribedInvestor.map((item, index)=> (
                    <Tr key={index}>
                        <Td>{item.name}</Td>
                        <Td textAlign={"right"}>{item.investment} {dealData.unit}</Td>
                    </Tr>
                    ))} */}
                </Tbody>
                </Table>
            </Box>
        </Box>
    )
}

