import { useState, useEffect, useContext } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import ProgressPercent from "./progress-percent";
import { RoundNumbers } from "../../../Utils/ComponentUtils";
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"


export default function FundingAmountCard(props) {

    const {dealMetadata, dealConfig, nftMetadata, totalRaised} = useContext(DealDetailsContext)  

    var roundSizeDisplay = ""
    var paymentTokenSymbol = ""
    var totalRaisedDisplay = ""

    var totalRaisedAmount = undefined
    var minRoundSize = undefined
    var maxRoundSize = undefined

    if (totalRaised !== undefined && dealConfig) {
        const paymentToken = dealConfig.exchangeRate.paymentToken
        paymentTokenSymbol = paymentToken.symbol
        totalRaisedAmount = Number(paymentToken.getTokens(totalRaised))
        totalRaisedDisplay = `${totalRaisedAmount} ${paymentToken.symbol}`
        minRoundSize = Number(paymentToken.getTokens(dealConfig.investConfig.minTotalInvestment))
        maxRoundSize = Number(paymentToken.getTokens(dealConfig.investConfig.maxTotalInvestment))
        roundSizeDisplay = `${minRoundSize} - ${maxRoundSize}`
    }




    return(
        <Box layerStyle="detailSummaryWrap" w="46%" h="250px" px="40px">
            <Heading size="md" py="3px">
                Funding Amount
            </Heading>
            <HStack w="full" py="20px" spacing={5}>
                <Box layerStyle="detailSummaryWrap" w="50%">
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                    ROUND SIZE
                </Text>
                <Heading size="md" py="3px">
                    {roundSizeDisplay}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                    {paymentTokenSymbol}
                </Text>
                </Box>
                <Box layerStyle="detailSummaryWrap" w="50%">
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                    AMT RAISED
                </Text>
                <Heading size="md" py="3px">
                    {totalRaisedDisplay}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                    {paymentTokenSymbol}
                </Text>
                </Box>
            </HStack>
            <ProgressPercent maxRoundSize={maxRoundSize} amountRaised={totalRaisedAmount} paymentTokenSymbol={paymentTokenSymbol} />
        </Box>
    )
}