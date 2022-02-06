import {
    Text,
    GridItem,
    VStack,
    HStack,
    Button,
    Container,
} from '@chakra-ui/react';
import { CalendarIcon, CheckCircleIcon } from '@chakra-ui/icons';
import "react-datepicker/dist/react-datepicker.css";
import {useEffect, useState, useContext} from 'react';

import { useMoralis } from "react-moralis";
import {APP_ID, SERVER_URL} from "../../App";
import {MakeDealFormItem, MakeDealFormNumberItem} from './index';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './date-picker.css';

import {MakeDealFormContext} from '../../Contexts/MakeDealFormContext'
import {NetworkContext} from '../../Contexts/NetworkContext'
import SmartContractService from '../../Services/SmartContractService'


function DealFormStep2(props) { 

    const {
            decrementStep, 
            incrementStep, 
            nftAddress, 
            setNftAddress,
            paymentTokenAddress,
            setPaymentTokenAddress,
            minRoundSize,
            setMinRoundSize,
            maxRoundSize,
            setMaxRoundSize,
            minInvestPerInvestor,
            setMinInvestPerInvestor,
            maxInvestPerInvestor,
            setMaxInvestPerInvestor,
            investDeadline,
            setInvestDeadline
        } = useContext(MakeDealFormContext)
    const {selectedNetworkChainId} = useContext(NetworkContext)



    const [nftTokenMetadata, setNFTTokenMetadata] = useState(undefined);
    const [tokenMetadata, setTokenMetadata] = useState(undefined);

    const [nftMetadataIsLoading, setNftMetadataIsLoading] = useState(false)
    const [tokenMetadataIsLoading, setTokenMetadataIsLoading] = useState(false)

    function inputsAreVerified() {
        return ((nftTokenMetadata || nftAddress == "")
                && tokenMetadata 
                && minRoundSize
                && minRoundSize != ""
                && maxRoundSize != ""
                && minInvestPerInvestor != ""
                && maxInvestPerInvestor != ""
                && investDeadline)
    }

    async function validateNftAddress(tokenAddress) {
        setNftMetadataIsLoading(true)
        const metadata = await SmartContractService.getNFTMetadata(tokenAddress, selectedNetworkChainId)

        setNFTTokenMetadata(metadata)
        setNftMetadataIsLoading(false)

    }

    async function validateTokenAddress(tokenAddress) {
        setTokenMetadataIsLoading(true)
        const metadata = await SmartContractService.getERC20Metadata(tokenAddress, selectedNetworkChainId)

        setTokenMetadata(metadata)
        setTokenMetadataIsLoading(false)

    }

    useEffect(()=>{
        validateNftAddress(nftAddress)
    }, [nftAddress]);

    useEffect(()=>{
        validateTokenAddress(paymentTokenAddress)
    }, [paymentTokenAddress]);

    return (
        <GridItem colSpan={2} >
            <VStack w="65%" h="full" spacing={10} alignItems="flex-start">
                <VStack spacing={1} alignItems="flex-start">
                    <Text variant="dealStepTitle">Investment Constraints</Text>
                    <Text variant="dealStepDesc">Enter the investment requirements for your deal. This includes the NFT access requirement, the token used for payment, min/max round size, and min/max investment per investor.</Text>
                </VStack>
            </VStack>  

            <HStack w="full" h="full" pt={5} spacing={10} alignItems="flex-start">
                <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">
                    <MakeDealFormItem 
                        title="Required NFT"
                        colSpan={2}
                        onChange = {e => setNftAddress(e.target.value)}
                        placeholder = "ERC-721 NFT Contract Address"
                        value = {nftAddress}
                        onBlur = {e => setNftAddress(e.target.value.trim())}
                        isRequired = {false}
                        verified = {(nftTokenMetadata !== undefined)}
                        isVerifying = {nftMetadataIsLoading}
                        helperText = "(Optional) Investors will use an NFT of this collection to invest in the deal. They will be able to claim their allotted project tokens with the NFT they used to invest."
                        errorText = "Enter a valid ERC-721 NFT contract address."
                    />
                </HStack>
                <HStack w="30%" h="full" pt={10} spacing={10} alignItems="flex-start">
                    {(nftTokenMetadata !== undefined) && <Container variant="dealFormAlert">
                        <Text variant="dealFontWeight500">NFT validated <CheckCircleIcon mt="-2px" ml="3px" color="#7879F1"/></Text>
                        <Text>Name: {nftTokenMetadata.name}</Text>
                        <Text>Symbol: {nftTokenMetadata.symbol}</Text>
                    </Container>}
                </HStack>
            </HStack>

            <HStack w="full" h="full" pt={5} spacing={10} alignItems="flex-start">
                <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">
                    <MakeDealFormItem 
                        title="Payment Token"
                        colSpan={2}
                        onChange = {e => setPaymentTokenAddress(e.target.value)}
                        placeholder = "ERC-20 Token Contract Address"
                        value = {paymentTokenAddress}
                        onBlur = {e => setPaymentTokenAddress(e.target.value.trim())}
                        isRequired = {true}
                        verified = {(tokenMetadata !== undefined)}
                        isVerifying = {tokenMetadataIsLoading}
                        helperText = "Investors will use this token to invest."
                        errorText = "Enter a valid ERC-20 token contract address."
                    />
                </HStack>
                <HStack w="30%" h="full" pt={10} spacing={10} alignItems="flex-start">
                    {(tokenMetadata !== undefined) && <Container variant="dealFormAlert">
                        <Text variant="dealFontWeight500">Payment token validated <CheckCircleIcon mt="-2px" ml="3px" color="#7879F1"/></Text>
                        <Text>Name: {tokenMetadata.name}</Text>
                        <Text>Symbol: {tokenMetadata.symbol}</Text>
                        <Text>Decimals: {tokenMetadata.decimals}</Text>
                    </Container>}
                </HStack>
            </HStack>

            <HStack w="full" h="full" pt={5} spacing={10} alignItems="flex-start">
                <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">
                    <MakeDealFormNumberItem 
                        title="Minimum Round Size"
                        colSpan={2}
                        onChange = {value => setMinRoundSize(value)}
                        value = {minRoundSize}
                        width="50%"
                        appendChar = {tokenMetadata ? tokenMetadata.symbol : ""}
                        isRequired = {true}
                        disabled = {(tokenMetadata === undefined)}
                        verified = {minRoundSize != ""}
                        errorText = "Specify a payment token before round size."
                        helperText = "The minimum amount of the payment token that needs to be raised. If the minimum round size is not reached, any investor can claim a refund."
                    />
                    <MakeDealFormNumberItem 
                        title="Maximum Round Size"
                        colSpan={2}
                        onChange = {value => setMaxRoundSize(value)}
                        value = {maxRoundSize}
                        width="50%"
                        appendChar = {tokenMetadata ? tokenMetadata.symbol : ""}
                        isRequired = {true}
                        disabled = {(tokenMetadata === undefined)}
                        verified = {maxRoundSize != ""}
                        helperText = "The maximum amount of the payment token that can be raised by this deal."
                    />
                </HStack>
            </HStack>

            <HStack w="full" h="full" pt={5} spacing={10} alignItems="flex-start">
                <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">
                    <MakeDealFormNumberItem 
                        title="Minimum Investment Per Investor"
                        colSpan={2}
                        onChange = {value => setMinInvestPerInvestor(value)}
                        value = {minInvestPerInvestor}
                        width="50%"
                        appendChar = {tokenMetadata ? tokenMetadata.symbol : ""}
                        isRequired = {true}
                        disabled = {(tokenMetadata === undefined)}
                        verified = {minInvestPerInvestor != ""}
                        helperText = "The minimum amount of the payment token required by each investor/NFT."
                    />
                    <MakeDealFormNumberItem 
                        title="Maximum Investment Per Investor"
                        colSpan={2}
                        onChange = {value => setMaxInvestPerInvestor(value)}
                        value = {maxInvestPerInvestor}
                        width="50%"
                        isRequired = {true}
                        appendChar = {tokenMetadata ? tokenMetadata.symbol : ""}
                        disabled = {(tokenMetadata === undefined)}
                        verified = {maxInvestPerInvestor != ""}
                        helperText = "The maximum amount of the payment token allowed for each investor/NFT."
                    />
                </HStack>
            </HStack>

            <HStack w="full" h="full" pt={5} spacing={10} alignItems="flex-start">
                <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">
                    <MakeDealFormItem 
                        title="Investment Deadline"
                        colSpan={2}
                        onChange = {v => { console.log(v); console.log(typeof(v)); setInvestDeadline(v) }}
                        placeholder = "Dec 26, 2021 07:14:31"
                        value = {investDeadline}
                        width="47%"
                        dateformat = {true}
                        DatePicker={DatePicker}
                        isRequired = {true}
                        verified = {investDeadline && investDeadline.length > 0}
                        helperText = {`Deadline to invest by (${Intl.DateTimeFormat().resolvedOptions().timeZone} time)`}
                    />
                </HStack>
            </HStack>
            
            <HStack w="full" h="full" pt={40} spacing={10} alignItems="flex-start">
                <Button variant="dealformBack" size='lg' onClick={decrementStep}>Back</Button>
                <Button variant="dealForm2Details" size='lg' onClick={incrementStep} disabled = {!inputsAreVerified()}>Continue to project details</Button>
            </HStack>
        </GridItem>
    )
}

export default DealFormStep2;
