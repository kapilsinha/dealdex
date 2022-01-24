import { useState, useEffect } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import StepPercent from "./step-percent";
import ProgressPercent from "./progress-percent";
import { RoundNumbers } from "../../../Utils/ComponentUtils";


export default function FundingAmountCard(props) {

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
                    <RoundNumbers num={5000} /> - <RoundNumbers num={10000} />
                </Heading>
                <Text fontSize="sm" color="gray.500">
                    {"BAYC"}
                </Text>
                </Box>
                <Box layerStyle="detailSummaryWrap" w="50%">
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                    AMT RAISED
                </Text>
                <Heading size="md" py="3px">
                    <RoundNumbers num={10000} />
                </Heading>
                <Text fontSize="sm" color="gray.500">
                    {"USDC"}
                </Text>
                </Box>
            </HStack>
            <ProgressPercent percent={80} />
        </Box>
    )
}