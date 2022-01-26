import { useState, useEffect, useContext } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";

import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"


export default function ProjectCard(props) {

    const {dealMetadata, dealConfig, totalRaised} = useContext(DealDetailsContext)  

    var projectName = ""
    var tokenName = ""
    var tokenPrice = ""
    var totalRaisedDisplay = ""

    console.log(totalRaised)

    if (dealMetadata && totalRaised && dealConfig) {
        projectName = dealMetadata.getProject().getName()
        const projectTokenAddress = dealConfig.claimTokensConfig.startupTokenAddress
        const projectToken = dealConfig.exchangeRate.projectToken
        const paymentToken = dealConfig.exchangeRate.paymentToken
        if (projectTokenAddress) {
            tokenName = `${projectToken.name} (${projectToken.symbol})`
        } else {
            tokenName = "Not specified yet"
        }
        tokenPrice = `${dealConfig.exchangeRate.displayValue} ${paymentToken.symbol}`
        totalRaisedDisplay = `${paymentToken.getTokens(totalRaised)} ${paymentToken.symbol}`
        
    }



    return(
        <Box layerStyle="detailSummaryWrap" w="60%" h="340px" px="40px">
            <Heading size="md" py="3px">
                The Project
            </Heading>
            <Box layerStyle="detailSummaryWrap" w="100%" my="20px">
                <Table variant="dealDetailProjectTable" size="md">
                <Tbody>
                    <Tr>
                        <Td>Name</Td>
                        <Td textAlign={"right"}>{projectName}</Td>
                    </Tr>
                    <Tr>
                        <Td>Token</Td>
                        <Td textAlign={"right"}>{tokenName}</Td>
                    </Tr>
                    <Tr>
                        <Td>Token Price</Td>
                        <Td textAlign={"right"}>
                            {tokenPrice}
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Total Raised</Td>
                        <Td textAlign={"right"}>
                            {totalRaisedDisplay}
                        </Td>
                    </Tr>
                </Tbody>
                </Table>
            </Box>
        </Box>
    )
}