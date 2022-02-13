import { useState, useEffect, useContext } from "react";
import { Button, Center, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, Box, HStack, Grid, GridItem, VStack } from "@chakra-ui/react";
import dateFormat from "dateformat"
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"
import EditVestingModal from "./EditVestingModal"

export default function VestingScheduleCard(props) {

    const {userIsProject, dealMetadata} = useContext(DealDetailsContext)

    const dealMetadataIsLoading = dealMetadata === undefined

    var vestingDescription = undefined
    if (dealMetadata) {
        vestingDescription = dealMetadata.getVestingDescription()
    }

    return(
        <Box layerStyle="detailSummaryWrap" w="54%" h="250px" px="40px">
            <Heading size="md" py="3px">
                Vesting
            </Heading>
            {!dealMetadataIsLoading &&
                (vestingDescription ? <VestingDescription description={vestingDescription} /> : <StepPercent />)
            }
            
            <HStack mt={50} w="full" justify="center">
                {userIsProject && 
                    // <Button variant="dealDetailTable" size="lg">
                    //     Edit Vesting
                    // </Button>
                    <EditVestingModal />
                }
            </HStack>
        </Box>
    )
}

function VestingDescription(props) {
    const description = props.description
    return (
        <Center h='50px'>
            <Text>{description}</Text>
        </Center>
        
    )
}

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