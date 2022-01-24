import { useState, useEffect } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";

export default function ProjectCard(props) {
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
                        <Td textAlign={"right"}>Postered Eyewear</Td>
                    </Tr>
                    <Tr>
                        <Td>Token</Td>
                        <Td textAlign={"right"}>{"Postered Coin (PSTRD)"}</Td>
                    </Tr>
                    <Tr>
                        <Td>Token Price</Td>
                        <Td textAlign={"right"}>
                            {"52500.50"} {"USDC"}
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Total Raised</Td>
                        <Td textAlign={"right"}>
                            {"120000024"} {"USDC"}
                        </Td>
                    </Tr>
                </Tbody>
                </Table>
            </Box>
        </Box>
    )
}