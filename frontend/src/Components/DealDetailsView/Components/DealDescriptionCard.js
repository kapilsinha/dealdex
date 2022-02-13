import { useState, useEffect, useContext } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"
import UpdateDealDescriptionModal from "./UpdateDealDescriptionModal"

export default function DealDescriptionCard(props) {
    const {subscribedInvestors, dealConfig, dealMetadata, userIsManager} = useContext(DealDetailsContext)

    var description = ""

    if (dealMetadata) {
        description = dealMetadata.getDealDescription() || ""
    }

    return(
        <Box layerStyle="detailSummaryWrap" w="full" h="full" px="40px">
            <Heading size="md" py="3px">
                Description
            </Heading>
            <Box layerStyle="detailSummaryWrap" w="100%" my="20px">
                <Text whiteSpace="pre-line">{description}</Text>
            </Box>
            <HStack mt={0} w="full" justify="center">
                {userIsManager && 
                    <UpdateDealDescriptionModal />
                }
            </HStack>

        </Box>
    )
}

