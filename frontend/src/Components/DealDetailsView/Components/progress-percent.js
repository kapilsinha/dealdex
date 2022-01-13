import { Grid, GridItem, Box, VStack, Heading, Text, Container, Flex, SimpleGrid, Center } from '@chakra-ui/react';

function ProgressPercent(props) {
    return (
        <Grid templateColumns='repeat(1, 1fr)' w='100%'>
            <GridItem colStart={1} rowStart={1} w='100%' h='100%'>
                <Center w="full" h="30px">
                    <Center w="70%" h="30px" bg="gray.100" alignItems="flex-start">
                        <VStack w="full" h="full" alignItems="flex-start">
                            <Box width={props.percent+"%"} h="full" bg="#A5A6F6"></Box>
                        </VStack>
                    </Center>
                </Center>                                        
            </GridItem>
            <GridItem colStart={1} rowStart={1} w='100%' h='100%' textAlign="center" pt="3px">
                <Center w="full" h="full">
                    <Text color="white" fontSize="sm" fontWeight="700">2k USDC Remaining</Text>   
                </Center>             
            </GridItem>
        </Grid>
    )
}

export default ProgressPercent;
