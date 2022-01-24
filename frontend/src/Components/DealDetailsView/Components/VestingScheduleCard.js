import { useState, useEffect } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import StepPercent from "./step-percent";
import ProgressPercent from "./progress-percent";

export default function VestingScheduleCard(props) {

    return(
        <Box layerStyle="detailSummaryWrap" w="54%" h="250px" px="40px">
            <Heading size="md" py="3px">
                Vesting
            </Heading>
            <StepPercent percent={0} />
            <HStack mt={50} w="full" justify="center">
                <Button variant="dealDetailTable" size="lg">
                    Edit Vesting
                </Button>
            </HStack>
        </Box>
    )
}
