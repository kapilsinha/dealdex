import { useState, useEffect } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import {useLocation, useHistory} from 'react-router-dom'

import { ReactComponent as IconArrowRightUpLine } from "../../../assets/icon/ArrowRightUpLine.svg";


export default function SummaryRow(props) {

    return(
        <HStack w="full" py="20px" spacing={5}>
            <SummaryCard w="15%" title="STATUS" value="Invested" subText="You already invested" />
            <SummaryCard w="26%" title="INVESTMENT DEADLINE" value="May 3, 2022 07:14:31" subText="UTC time" />
            <SummaryCard w="20%" title="INVESTMENT PER NFT" value="500.50 - 10000" subText="USDC" />
            <SummaryCard w="20%" title="REQUIRED NFT" value="BAYC" subText="Bored Ape Yacht Club" />
            <SummaryCard w="14%" title="TOKEN PRICE" value="5200.50" subText="USDC" />
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