import { 
    Box, 
    VStack, 
    HStack,
    Heading,
    Table, 
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    Button,
    useToast
} from '@chakra-ui/react';
import {useEffect, useContext} from 'react';
import { useMoralis } from "react-moralis";
import {APP_ID, SERVER_URL} from "../../../App";
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"
import SmartContractService from "../../../Services/SmartContractService"

function MyInvestment(props) {
    
    const {user} = useMoralis()
    const toast = useToast();
    const {investedNfts, dealConfig, dealIsLocked, dealMetadata} = useContext(DealDetailsContext)

    const paymentToken = dealConfig ? dealConfig.exchangeRate.paymentToken: undefined
    
    const buttonIsEnabled = user && dealMetadata

    async function claimTokens(nftId) {
        const dealAddress = dealMetadata.getAddress()

        const result = await SmartContractService.claimTokens(dealAddress, nftId, user)

        if (result.error) {
            toast({
                title: result.error,
                status: "error",
                isClosable: true,
                position: "bottom-right",
            });
        } else {
            toast({
                title: "Successfully claimed tokens",
                status: "success",
                isClosable: true,
                position: "bottom-right",
            });
        }
    }

    async function claimRefund(nftId) {
        const dealAddress = dealMetadata.getAddress()

        const result = await SmartContractService.claimRefund(dealAddress, nftId, user)

        if (result.error) {
            toast({
                title: result.error,
                status: "error",
                isClosable: true,
                position: "bottom-right",
            });
        } else {
            toast({
                title: "Successfully claimed refund",
                status: "success",
                isClosable: true,
                position: "bottom-right",
            });
        }
    }

    return (
        <VStack w="full" spacing={3} alignItems="flex-start">
            {paymentToken && <HStack w="full" py="10px" spacing={5}>
                <Table variant='dealDetailProjectTable' size='md'>
                    <Thead>
                        <Tr>
                        <Th textAlign="center">NFT</Th>
                        <Th textAlign="center">Amount Invested</Th>
                        <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            investedNfts.map(investData => {
                                const {investedNft, investment} = investData
                                console.log(investData)
                                const nftId = investedNft.token_id 
                                const symbol = investedNft.symbol
                                return (
                                    <Tr key={nftId}>
                                        <Td px={2} textAlign="center">{symbol} #{nftId}</Td>
                                        <Td px={2} textAlign="center">{paymentToken.getTokens(investment)} {symbol}</Td>
                                        <Td px={1} py={0}>{dealIsLocked !== undefined &&
                                            (dealIsLocked ? 
                                                <Button variant="dealDetailTable" onClick={() => claimTokens(nftId)} isDisabled={!buttonIsEnabled}>
                                                    Claim tokens
                                                </Button> :
                                                <Button variant="dealDetailTable" onClick={() => claimRefund(nftId)} isDisabled={!buttonIsEnabled}>
                                                    Refund
                                                </Button>)
                                        }</Td>
                                    </Tr>
                                )
                            })
                        }
                    </Tbody>
                </Table>
            </HStack>}
        </VStack>
    )
}

export default MyInvestment;
