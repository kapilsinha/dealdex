import {
    GridItem,
    HStack,
    VStack,
    Button,
    Text,
    Container,
    Grid,
} from '@chakra-ui/react';
import { CalendarIcon, CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import {useEffect, useState, useContext} from 'react';
import "react-datepicker/dist/react-datepicker.css";
import {MakeDealFormItem, MakeDealFormNumberItem} from './index';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './date-picker.css';

import { useMoralis } from "react-moralis";
//import Moralis from "moralis/types";
import {APP_ID, SERVER_URL} from "../../App";
import {MakeDealFormContext} from '../../Contexts/MakeDealFormContext'
import SmartContractService from '../../Services/SmartContractService';
import {NetworkContext} from '../../Contexts/NetworkContext'


function DealFormStep3(props) {

    const {
        decrementStep, 
        incrementStep, 
        paymentTokenAddress,
        projectWalletAddress, 
        setProjectWalletAddress,
        projectTokenPrice,
        setProjectTokenPrice,
        projectTokenAddress,
        setProjectTokenAddress,
        vestingSchedule,
        setVestingSchedule
    } = useContext(MakeDealFormContext)

    const {selectedNetworkChainId} = useContext(NetworkContext)

    const [paymentTokenMetadata, setPaymentTokenMetadata] = useState(undefined);

    const [projectTokenMetadataIsLoading, setProjectTokenMetadataIsLoading] = useState(false)
    const [projectTokenMetadata, setProjectTokenMetadata] = useState(undefined)

    const [vestDate, setVestDate] = useState("")
    const [vestPercent, setVestPercent] = useState("")  

    const addVestList = () => {
        const date = vestDate
        const percent = vestPercent
        if (date != "" && percent != "") {
            setVestingSchedule([...vestingSchedule, {date, percent}])
        }
    }

    const removeVestList = (index) => {
        const newSchedule = vestingSchedule.filter((vest, inx) => inx !== index)
        setVestingSchedule(newSchedule);
    }

    async function validateProjectTokenAddress(tokenAddress) {
        setProjectTokenMetadataIsLoading(true)
        const metadata = await SmartContractService.getERC20Metadata(tokenAddress, selectedNetworkChainId)

        setProjectTokenMetadata(metadata)
        setProjectTokenMetadataIsLoading(false)

    }

    function getValidatedAddress(address) {
        return SmartContractService.getChecksumAddress(address)
    }

    function inputsAreValid() {
        return (getValidatedAddress(projectWalletAddress)
                && projectTokenPrice != ""
                && projectTokenIsValid()
                && vestingScheduleIsValid()
        )
    }

    function vestingScheduleIsValid() {
        if (vestingSchedule.length == 0) {
            return true
        } else {
            let lastElement = vestingSchedule[vestingSchedule.length - 1]
            return lastElement.percent == 100
        }
    }

    function projectTokenIsValid() {
        if (projectTokenAddress == "") {
            return true
        } else {
            return projectTokenMetadata
        }
    }

    useEffect(()=>{
        validateProjectTokenAddress(projectTokenAddress)
    }, [projectTokenAddress]);


    useEffect(()=>{
        async function fetchAndSetPaymentTokenMetadata() {
            let metadata = await SmartContractService.getERC20Metadata(paymentTokenAddress, selectedNetworkChainId)
            setPaymentTokenMetadata(metadata)
        }        
        fetchAndSetPaymentTokenMetadata()
    }, []);

    return (
        <GridItem colSpan={2} >
            <VStack w="65%" h="full" spacing={10} alignItems="flex-start">
                <VStack spacing={1} alignItems="flex-start">
                    <Text variant="dealStepTitle">Project Details</Text>
                    <Text variant="dealStepDesc">Enter information about the project you will be funding with this deal: the project’s wallet address, the project’s token price, and (if applicable) the token’s contract address.</Text>
                </VStack>
            </VStack>  
            
            <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">
                <MakeDealFormItem 
                    title="Project’s wallet"
                    colSpan={2}
                    onChange = {e => {
                            let validatedAddress = getValidatedAddress(e.target.value)
                            if (validatedAddress) {
                                setProjectWalletAddress(validatedAddress)
                            } else {
                                setProjectWalletAddress(e.target.value)
                            }
                            
                        }}
                    placeholder = "Project’s Wallet Address"
                    value = {projectWalletAddress}
                    isRequired = {true}
                    verified = {getValidatedAddress(projectWalletAddress)}
                    helperText = "This wallet will be able to withdraw all funds from the deal once the minimum round size has been reached."
                    errorText = "Please enter a valid wallet address"
                />
            </HStack>

            <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">
                <MakeDealFormNumberItem 
                    title="Project Token Price"
                    colSpan={2}
                    onChange = {value => setProjectTokenPrice(value)}
                    value = {projectTokenPrice}
                    width="50%"
                    appendChar = {paymentTokenMetadata ? paymentTokenMetadata.symbol : ""}
                    isRequired = {true}
                    disabled = {(paymentTokenMetadata === undefined)}
                    verified = {projectTokenPrice != ""}
                    helperText = "The price of the project’s token. This can be updated by the project in the future."
                />
            </HStack>

            <HStack w="full" h="full" pt={5} spacing={10} alignItems="flex-start">
                <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">
                    <MakeDealFormItem 
                        title="Project Token"
                        colSpan={2}
                        onChange = {e => setProjectTokenAddress(e.target.value)}
                        placeholder = "ERC-20 Token Contract Address"
                        value = {projectTokenAddress}
                        onBlur = {e => setProjectTokenAddress(e.target.value.trim())}
                        verified = {(projectTokenMetadata !== undefined)}
                        isVerifying = {projectTokenMetadataIsLoading}
                        isRequired = {false}
                        helperText = "(Optional) The project’s token which will be distributed to investors. This can be specified at a later time as well."
                        errorText = "Enter a valid ERC-20 token contract address."
                    />
                </HStack>
                <HStack w="30%" h="full" pt={10} spacing={10} alignItems="flex-start">
                    {projectTokenMetadata && <Container variant="dealFormAlert">
                        <Text variant="dealFontWeight500">Project token validated <CheckCircleIcon mt="-2px" ml="3px" color="#7879F1"/></Text>
                        <Text>Name: {projectTokenMetadata.name}</Text>
                        <Text>Symbol: {projectTokenMetadata.symbol}</Text>
                        <Text>Decimals: {projectTokenMetadata.decimals}</Text>
                    </Container>}
                </HStack>
            </HStack>

            <HStack w="full" h="full" pt={5} spacing={10} alignItems="flex-start">
                <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">

                    <MakeDealFormItem 
                        title="Vest Date"
                        colSpan={2}
                        onChange = {v => { setVestDate(v) }}
                        placeholder = "Dec 26, 2021 07:14:31"
                        value = {vestDate}
                        width="50%"
                        dateformat = {true}
                        DatePicker={DatePicker}
                        helperText = {`Date that tokens will invest (${Intl.DateTimeFormat().resolvedOptions().timeZone} time)`}
                    />

                    <MakeDealFormNumberItem 
                        title="Vest Percentage"
                        colSpan={2}
                        onChange = {value => setVestPercent(value)}
                        placeholder = "0.0"
                        value = {vestPercent}
                        width="50%"
                        maxvalue={100}
                        appendChar = {"%"}
                        precision = {2} // We are using Bps for percentages
                        helperText = "Percentage of tokens that will vest on the selected date"
                    />
                </HStack>
                <HStack w="30%" h="full" pt={10} spacing={10} alignItems="flex-start" display="block">   
                    <VStack w="full" spacing={1} alignItems="flex-start">  
                    {vestingSchedule.map((vest, index) => (
                        <Grid templateColumns='repeat(1, 1fr)' w='100%'>
                            <GridItem colStart={1} rowStart={1} w='100%' h='100%'>
                                <Container variant="dealFormAlert">
                                    <Text variant="dealFontWeight500">Vesting Step {index + 1}</Text>
                                    <Text>{(new Date(vest.date)).toString()}</Text>
                                    <Text>Percentage: {vest.percent}%</Text>  
                                </Container>
                            </GridItem>
                            <GridItem colStart={1} rowStart={1} w='100%' h='100%' textAlign="right" px="15px" py="10px">
                                <CloseIcon onClick={()=>removeVestList(index)} width="10px" height="10px" cursor="Pointer"/>
                            </GridItem>
                        </Grid>
                    ))}
                    </VStack>
                </HStack>
            </HStack>

            <HStack w="full" h="full" pt={10} spacing={10} alignItems="flex-start">
                <Button variant="dealformAdd" size='lg' onClick={()=>addVestList()}>Add to vesting schedule</Button>
            </HStack>            
            
            <HStack w="full" h="full" pt={40} spacing={10} alignItems="flex-start">
                <Button variant="dealformBack" size='lg' onClick={decrementStep}>Back</Button>
                <Button variant="dealform3Fee" size='lg' onClick={incrementStep} disabled = {!inputsAreValid()}>Continue to fees</Button>
            </HStack>
        </GridItem>
    )
}

export default DealFormStep3;
