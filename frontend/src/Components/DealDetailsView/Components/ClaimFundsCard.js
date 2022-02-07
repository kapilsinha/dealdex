import { useState, useEffect, useContext } from "react";
import { Button,  Heading,  VStack, Box, HStack, useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import DealDexNumberForm from "../../../ReusableComponents/DealDexNumberForm"
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"
import {NetworkContext} from "../../../Contexts/NetworkContext"
import SmartContractService from "../../../Services/SmartContractService"
import {useMoralis} from "react-moralis"

export default function ClaimFundsCard(props) {
    return(
        <Box layerStyle="detailSummaryWrap" w="40%" h="340px" px="20px">
            <Tabs mt={4} >
                <TabList>
                    <Tab>Claim Funds</Tab>
                    <Tab ml={50}>Deposit Tokens</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <ClaimFunds />
                    </TabPanel>
                    <TabPanel>
                        <DepositTokens />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

function ClaimFunds(props) {

    const {dealConfig, dealMetadata} = useContext(DealDetailsContext)
    const {selectedNetworkChainId} = useContext(NetworkContext)
    const {user} = useMoralis()
    const toast = useToast()

    const [availableFundsDisplay, setAvailableFundsDisplay] = useState("")
    const [symbol, setSymbol] = useState("")

    

    useEffect(() => {
        async function initializeData() {

            const paymentToken = dealConfig.exchangeRate.paymentToken
            const availableFundsInContract = await SmartContractService.getERC20Balance(
                paymentToken.contractAddress, 
                dealMetadata.getAddress(), 
                selectedNetworkChainId
            )
            setSymbol(paymentToken.symbol)
            if (availableFundsInContract !== undefined) {
                setAvailableFundsDisplay(paymentToken.getTokens(availableFundsInContract))
                console.log(availableFundsDisplay)
            }
        }

        if (dealConfig && dealMetadata) {
            initializeData()
        }

    }, [dealConfig, dealMetadata])

    

    function buttonIsEnabled() {
        return availableFundsDisplay && Number(availableFundsDisplay) > 0 && dealMetadata && user
    }

    async function claimFunds() {
        const result = await SmartContractService.claimFunds(dealMetadata.getAddress(), user)

        if (result.error) {
            toast({
                title: result.error,
                status: "error",
                isClosable: true,
                position: "bottom-right",
            });
        } else {
            toast({
                title: "Successfully claimed funds",
                status: "success",
                isClosable: true,
                position: "bottom-right",
            });
        }
    }

    return(
        <VStack mb={5}>
            <HStack pb={3} w="full">
                <Heading size="sm" py="3px" w="full" textAlign="left">
                    Available funds:
                </Heading>
                <Heading size="sm" py="3px" w="full" textAlign="right">
                    {availableFundsDisplay} {symbol}
                </Heading>
            </HStack>
            <HStack mt={50} w="full" justify="center">
                <Button variant="dealDetailTable" onClick={claimFunds} isDisabled={!buttonIsEnabled()} size="lg">
                    Claim Funds
                </Button>
            </HStack>
        </VStack>
    )
}

function DepositTokens() {

    const {dealConfig, dealMetadata} = useContext(DealDetailsContext)
    const {selectedNetworkChainId} = useContext(NetworkContext)
    const {user} = useMoralis()

    const [amtToDeposit, setAmtToDeposit] = useState("0")

    var symbol = ""

    const projectToken = dealConfig.exchangeRate.projectToken

    if (projectToken) {
        symbol = projectToken.symbol
    }

    function buttonIsEnabled() {
        return projectToken && amtToDeposit && dealMetadata && user
    }

    function depositTokens() {
        const tokenAddress = projectToken.contractAddress
        const dealAddress = dealMetadata.getAddress()
        const result = SmartContractService.sendERC20Tokens(tokenAddress, dealAddress, user, amtToDeposit)
    }

    return(
        <VStack mb={5}>
            <VStack mb={5}>
                <DealDexNumberForm 
                    title="Amount to deposit"
                    colSpan={2}
                    onChange = {value => setAmtToDeposit(value)}
                    value = {amtToDeposit}
                    width="100%"
                    appendChar = {symbol}
                    isRequired = {false}
                    disabled = {false}
                    min={0}
                />
            </VStack>
            <HStack mt={30} w="full" justify="center">
                <Button variant="dealDetailTable" onClick={depositTokens} isDisabled={!buttonIsEnabled()} size="lg">
                    Deposit Tokens
                </Button>
            </HStack>
        </VStack>
    )
}
