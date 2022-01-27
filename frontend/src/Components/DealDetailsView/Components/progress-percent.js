import { Grid, GridItem, Box, VStack, Heading, Text, Container, Flex, SimpleGrid, Center } from '@chakra-ui/react';
import React, { useEffect, useState, useContext } from "react";


function ProgressPercent(props) {

    const maxRoundSize = props.maxRoundSize
    const amountRaised = props.amountRaised
    const paymentTokenSymbol = props.paymentTokenSymbol

    function getPercent(num, denom) {
        return `${(num / denom) * 100.0}%`
    }

    var percent = ""
    var remainingText = ""



    if (maxRoundSize && amountRaised !== undefined && paymentTokenSymbol) {
        percent  = (getPercent(amountRaised, maxRoundSize))
        remainingText = (`${maxRoundSize - amountRaised} ${paymentTokenSymbol} Remaining`)
    }

    return (
        <Grid templateColumns='repeat(1, 1fr)' w='100%'>
            {percent && remainingText &&
            <>
                <GridItem colStart={1} rowStart={1} w='100%' h='100%'>
                    <Center w="full" h="30px">
                        <Center w="70%" h="30px" bg="gray.100" alignItems="flex-start">
                            <VStack w="full" h="full" alignItems="flex-start">
                                <Box width={percent} h="full" bg="#A5A6F6"></Box>
                            </VStack>
                        </Center>
                    </Center>                                        
                </GridItem>
                <GridItem colStart={1} rowStart={1} w='100%' h='100%' textAlign="center" pt="3px">
                    <Center w="full" h="full">
                        <Text color="white" fontSize="sm" fontWeight="700">{remainingText}</Text>   
                    </Center>             
                </GridItem>
            </>
            }
        </Grid>
    )
}

export default ProgressPercent;
