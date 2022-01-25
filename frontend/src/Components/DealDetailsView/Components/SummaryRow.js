import { useState, useEffect, useContext } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import {useLocation, useHistory} from 'react-router-dom'

import { ReactComponent as IconArrowRightUpLine } from "../../../assets/icon/ArrowRightUpLine.svg";
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"
import dateFormat, { masks } from "dateformat";

export default function SummaryRow(props) {

    const {dealMetadata, dealConfig, nftMetadata} = useContext(DealDetailsContext)  

    var fees = ""
    var deadline = ""
    var deadlineTimeZone = ""
    var minInvestPerNft = ""
    var maxInvestPerNft = ""
    var paymentTokenSymbol = ""
    var requiredNftSymbol = ""
    var requiredNftName = ""
    var tokenPrice = ""

    if (dealConfig) {
        const paymentToken = dealConfig.exchangeRate.paymentToken
        paymentTokenSymbol = paymentToken.symbol

        const dealDexFees = (dealConfig.claimFundsConfig.dealdexFeeBps + dealConfig.claimTokensConfig.dealdexFeeBps) / 100.0
        const syndicateFees = (dealConfig.claimFundsConfig.managerFeeBps + dealConfig.claimTokensConfig.managerFeeBps) / 100.0
        fees = `${dealDexFees}% + ${syndicateFees}%`
        deadline = dateFormat(dealConfig.investConfig.deadline, "mm/dd/yyyy HH:MM:ss")
        deadlineTimeZone = dateFormat(dealConfig.investConfig.deadline, "Z")
        minInvestPerNft = paymentToken.getTokens(dealConfig.investConfig.minInvestmentPerInvestor)
        maxInvestPerNft = paymentToken.getTokens(dealConfig.investConfig.maxInvestmentPerInvestor)
        tokenPrice = dealConfig.exchangeRate.displayValue
    }

    if (nftMetadata) {
        requiredNftName = nftMetadata.name 
        requiredNftSymbol = nftMetadata.symbol
    }
     

    return(
        <HStack w="full" py="20px" spacing={5}>
            <SummaryCard w="17%" title="FEES" value={fees} subText="Dealdex + syndicate fee" />
            <SummaryCard w="22%" title="INVESTMENT DEADLINE" value={deadline} subText={deadlineTimeZone} />
            <SummaryCard w="18%" title="INVESTMENT PER NFT" value={`${minInvestPerNft}- ${maxInvestPerNft}`} subText={paymentTokenSymbol} />
            <SummaryCard w="20%" title="REQUIRED NFT" value={requiredNftSymbol} subText={requiredNftName} />
            <SummaryCard w="14%" title="TOKEN PRICE" value={tokenPrice} subText={paymentTokenSymbol} />
        </HStack>
    )
    
}

function SummaryCard(props) {

    const w = props.w
    const title=props.title
    const value=props.value
    const subText = props.subText

    return(
        <Box layerStyle="detailSummaryWrap" w={w}>
            <Text fontSize="sm" color="gray.500" fontWeight="500">
                {title}
            </Text>

            {/* <HStack justify="space-between">
                <Heading size="md" py="3px">
                {dealData.nftName}
                </Heading>
                <Button variant='ghost' size="xs"><IconArrowRightUpLine /></Button>
            </HStack> */}

            <Heading size="md" py="3px">
                {value}
            </Heading>
            <Text fontSize="sm" color="gray.500">
                {subText}
            </Text>
        </Box>
    )
}