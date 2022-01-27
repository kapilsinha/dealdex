import { useState, useEffect, useContext } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"


export default function SubscribedInvestorsCard(props) {
    const {subscribedInvestors, dealConfig} = useContext(DealDetailsContext)

    var nfts = []
    var investments = []


    if (subscribedInvestors && dealConfig) {
        console.log(subscribedInvestors)
        const paymentToken = dealConfig.exchangeRate.paymentToken
        nfts = subscribedInvestors._investmentKeys.map(investmentKey => investmentKey.id.toNumber())
        investments = subscribedInvestors._investments.map((tokenBits) => {
            return `${paymentToken.getTokens(tokenBits)} ${paymentToken.symbol}`
        })
    }

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
                    { nfts.map((nft, index)=> (
                    <Tr key={index}>
                        <Td>{nft}</Td>
                        <Td textAlign={"right"}>{investments[index]}</Td>
                    </Tr>
                    ))}
                </Tbody>
                </Table>
            </Box>
        </Box>
    )
}

