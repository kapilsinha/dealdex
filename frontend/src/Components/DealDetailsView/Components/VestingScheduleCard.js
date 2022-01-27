import { useState, useEffect, useContext } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, Box, HStack, Grid, GridItem, VStack } from "@chakra-ui/react";
import dateFormat from "dateformat"
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"


export default function VestingScheduleCard(props) {

    const {userIsProject} = useContext(DealDetailsContext)

    return(
        <Box layerStyle="detailSummaryWrap" w="54%" h="250px" px="40px">
            <Heading size="md" py="3px">
                Vesting
            </Heading>
            <StepPercent percent={0} />
            <HStack mt={50} w="full" justify="center">
                {userIsProject && 
                    <Button variant="dealDetailTable" size="lg">
                        Edit Vesting
                    </Button>
                }
            </HStack>
        </Box>
    )
}

const steps = [
    { label: "25%", description: 1646406000 },
    { label: "50%", description: 1649084400 },
    { label: "70%", description: 1651676400 },
    { label: "100%", description: 1654354800 },
]


function StepPercent(props) {
    const {dealConfig} = useContext(DealDetailsContext)

    var vestingDates = []
    var vestingPercentages = []
    
    if (dealConfig) {
        vestingDates = dealConfig.vestingSchedule.vestingDates
        vestingPercentages = dealConfig.vestingSchedule.vestingBps.map(bps => {
            return `${bps / 100.0}%`
        })
    }
    

    return (
        <Grid templateColumns='repeat(4, 1fr)' gap={6} px={0} py="20px">
            {vestingDates.map(( date , index) => {
                 const dateDisplay = dateFormat(date, "paddedShortDate");
                 const percent = vestingPercentages[index]
                 const today = new Date()
                 const dateHasPassed = today.getTime() >= date.getTime()
                 return (
                    <GridItem w='100%' h='10' key={index}>
                        <Box w='100%' h='1' bg={dateHasPassed ? '#7879F1' : '#E2E8F0'}/>
                        <VStack spacing={0} alignItems="flex-start">
                            <Text pt={2} color='#718096'>{percent}</Text>
                            <Text>{dateDisplay}</Text>
                        </VStack>
                    </GridItem>
                 );
            })}
        </Grid>
    )
}