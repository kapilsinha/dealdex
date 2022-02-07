import { useState, useEffect, useContext } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"


export default function SubscribedInvestorsCard(props) {
    const {subscribedInvestors, dealConfig} = useContext(DealDetailsContext)

    var nfts = []
    var investments = []
    var addresses = []

    if (subscribedInvestors && dealConfig) {
        console.log(subscribedInvestors)
        const paymentToken = dealConfig.exchangeRate.paymentToken
        nfts = subscribedInvestors._investmentKeys.map(investmentKey => investmentKey.id.toNumber())
        addresses = subscribedInvestors._investmentKeys.map(investmentKey => investmentKey.addr)
        investments = subscribedInvestors._investments.map((tokenBits) => {
            return `${paymentToken.getTokens(tokenBits)} ${paymentToken.symbol}`
        })
    }

    const gateToken = dealConfig ? dealConfig.investConfig.gateToken : undefined

    return(
        <Box layerStyle="detailSummaryWrap" w="full" h="full" px="40px">
            <Heading size="md" py="3px">
                Subscribed Investors
            </Heading>
            <Box layerStyle="detailSummaryWrap" w="100%" my="20px">
                <Table variant="dealDetailProjectTable" size="md">
                <Thead>
                    <Tr>
                    <Th>{gateToken ? "NFT ID" : "Wallet ID"}</Th>
                    <Th textAlign={"right"}>Investment</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {gateToken ?
                        nfts.map((nft, index)=> (
                            <Tr key={index}>
                                <Td>{nft}</Td>
                                <Td textAlign={"right"}>{investments[index]}</Td>
                            </Tr>
                        ))
                        : addresses.map((address, index)=> (
                            <Tr key={index}>
                                <Td>{address}</Td>
                                <Td textAlign={"right"}>{investments[index]}</Td>
                            </Tr>
                        ))
                    }
                </Tbody>
                </Table>
            </Box>
        </Box>
    )
}

