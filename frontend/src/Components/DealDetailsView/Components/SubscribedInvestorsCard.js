import { useState, useEffect, useContext } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"
import {NetworkContext} from "../../../Contexts/NetworkContext"
import DatabaseService from "../../../Services/DatabaseService";
import SmartContractService from "../../../Services/SmartContractService";


export default function SubscribedInvestorsCard(props) {
    const {subscribedInvestors, dealConfig} = useContext(DealDetailsContext)
    const {selectedNetworkChainId} = useContext(NetworkContext)

    var nfts = []
    var addresses = []
    var investments = []
    const gateToken = dealConfig ? dealConfig.investConfig.gateToken : undefined

    const [emails, setEmails] = useState([])

    if (subscribedInvestors && dealConfig) {
        console.log(subscribedInvestors)
        const paymentToken = dealConfig.exchangeRate.paymentToken
        nfts = subscribedInvestors._investmentKeys.map(investmentKey => investmentKey.id.toNumber())
        addresses = subscribedInvestors._investmentKeys.map(investmentKey => investmentKey.addr)
        investments = subscribedInvestors._investments.map((tokenBits) => {
            return `${paymentToken.getTokens(tokenBits)} ${paymentToken.symbol}`
        })
    }

    useEffect(() => {
        async function initialize() {
            console.log("Y:", gateToken, addresses, nfts)
            if (gateToken) {
                // NFT -> NFT owner wallet address -> NetworkUser -> ContactInfo
                setEmails(
                    await Promise.all(nfts.map(
                        async nft => {
                            let ownerAddress = await SmartContractService.getNFTOwnerAddress(gateToken, nft, selectedNetworkChainId)
                            if (ownerAddress) {
                                let user = await DatabaseService.getUser(ownerAddress)
                                if (user) {
                                    let contactInfo = await user.getContactInfo()
                                    if (contactInfo) {
                                        return contactInfo.getEmail()
                                    }
                                }
                            }
                            return "<no-email>"
                        }
                    ))
                )
            } else {
                // Wallet address -> NetworkUser -> ContactInfo
                setEmails(
                    await Promise.all(addresses.map(
                        async addr => {
                            let user = await DatabaseService.getUser(addr)
                            let contactInfo = await user.getContactInfo()
                            return contactInfo ? contactInfo.getEmail() : "<no-email>"
                        }
                    ))
                )
            }
        }
        initialize()
        // Don't fing pass in arrays of objects because it compares the references. Each time useEffect is called, the reference
        // gets updated -> infinite loop. The below assumes addresses and nfts are only appended/removed, each entry is never
        // modified. Hacky but works here
    }, [gateToken, addresses.length, nfts.length])

    return(
        <Box layerStyle="detailSummaryWrap" w="full" h="full" px="40px">
            <Heading size="md" py="3px">
                Subscribed Investors
            </Heading>
            <Box layerStyle="detailSummaryWrap" w="100%" my="20px">
                <Table variant="dealDetailProjectTable" size="md">
                <Thead>
                    <Tr>
                    <Th>{gateToken ? "NFT ID" : "Wallet ID"}</Th>
                    <Th textAlign={"center"}>Email</Th>
                    <Th textAlign={"right"}>Investment</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {gateToken ?
                        nfts.map((nft, index)=> (
                            <Tr key={index}>
                                <Td>{nft}</Td>
                                <Td textAlign={"center"}>{emails[index]}</Td>
                                <Td textAlign={"right"}>{investments[index]}</Td>
                            </Tr>
                        ))
                        : addresses.map((address, index)=> (
                            <Tr key={index}>
                                <Td>{address}</Td>
                                <Td textAlign={"center"}>{emails[index]}</Td>
                                <Td textAlign={"right"}>{investments[index]}</Td>
                            </Tr>
                        ))
                    }
                </Tbody>
                </Table>
            </Box>
        </Box>
    )
}

