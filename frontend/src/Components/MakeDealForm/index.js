import React, {useState, setState, useContext} from 'react';
import {ethers} from 'ethers';
import {Deal} from '../../DataModels/DealData';
import DealService from '../../Services/DealService'
import User from '../../DataModels/User'
import { Flex, Container, Box, Center, ChakraProvider } from '@chakra-ui/react';
import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Text,
    VStack,
    InputGroup,
    InputRightElement,
    InputLeftElement,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormErrorMessage,
} from '@chakra-ui/react';
import { CalendarIcon, CheckCircleIcon } from '@chakra-ui/icons';
import AuthStrings from "../../Strings/AuthStrings"
import "react-datepicker/dist/react-datepicker.css";
import {useHistory} from "react-router-dom"

import DealFormStep1 from './DealFormStep1';
import DealFormStep2 from './DealFormStep2';
import DealFormStep3 from './DealFormStep3';
import DealFormStep4 from './DealFormStep4';
import DealFormStep5 from './DealFormStep5';
import StepsComponent from './StepsComponent'; 
import {useMoralis} from 'react-moralis'
import {MakeDealFormContext} from '../../Contexts/MakeDealFormContext'

function MakeDealForm(props) {
    // This is doubling as the display variable so 'none' is the only valid default value
    const [dealData, setDealData] = useState(Deal.empty());
    const [activeStep, setActiveStep] = useState(2);

    const {isAuthenticated, isAuthenticating, authenticate} = useMoralis()

    const {step} = useContext(MakeDealFormContext)

    const handleNextStep = () => {
        let val = activeStep === 5 ? 5 : activeStep + 1;        
        setActiveStep(val);
    }

    const handlePrevStep = () => {       
        let val = activeStep === 1 ? 1 : activeStep - 1; 
        setActiveStep(val);
    }

    return (
            <Container maxW="container.xl" p={0}>
                <Flex
                    h={{ base: 'auto' }}
                    pt={[0, 10, 20]}
                    direction={{ base: 'column-reverse', md: 'row' }}
                    >
                    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
                        <VStack spacing={3} alignItems="flex-start">
                            <Heading size="2xl">Create a Deal</Heading>
                            <Text>Create an NFT-gated deal so your DAO, syndicate, or investment group can ape into a project.</Text>
                        </VStack>
                    </VStack>          
                </Flex>
                <Flex
                    h={{ base: 'auto' }}
                    pb={[0, 10, 20]}
                    direction={{ base: 'column-reverse', md: 'cloumn' }}
                    >
                    <StepsComponent activeStep={step}/>
                </Flex>
                {
                    isAuthenticated ? <Flex
                        h={{ base: 'auto' }}
                        pb={[0, 10, 20]}
                        px={10}
                        direction={{ base: 'column-reverse', md: 'cloumn' }}
                        >
                        <Box p={10} borderRadius={4} borderColor='#E2E8F0' borderWidth={1}>
                            {(step === 1) &&<DealFormStep1 dealData={dealData} setDealData={setDealData} nextStep={handleNextStep}/>}
                            {(step === 2) &&<DealFormStep2 dealData={dealData} setDealData={setDealData} nextStep={handleNextStep} prevStep={handlePrevStep}/>}
                            {(step === 3) &&<DealFormStep3 dealData={dealData} setDealData={setDealData} nextStep={handleNextStep} prevStep={handlePrevStep}/>}
                            {(step === 4) &&<DealFormStep4 dealData={dealData} setDealData={setDealData} nextStep={handleNextStep} prevStep={handlePrevStep}/>}
                            {(step === 5) &&<DealFormStep5 dealData={dealData} setDealData={setDealData} nextStep={handleNextStep} prevStep={handlePrevStep}/>}
                        </Box>
                    </Flex> : <Flex
                        h={{ base: 'auto' }}
                        pb={[0, 10, 20]}
                        px={10}
                        direction={{ base: 'column-reverse', md: 'cloumn' }}
                        >
                        <Center p={10} borderRadius={4} borderColor='#E2E8F0' borderWidth={1} h={{ base: 'auto', md: '30vh' }}>
                            <Button variant="dealForm2Details" size="lg" onClick={() => {authenticate({signingMessage: AuthStrings.signingMessage})}} isLoading={isAuthenticating}>
                                Connect Wallet
                            </Button>
                        </Center>
                    </Flex>
                }
            </Container>
    )
}

export function MakeDealFormItem(props) {
    let title = props.title
    let onBlur = props.onBlur
    let colSpan = props.colSpan
    let onChange = props.onChange
    let placeholder = props.placeholder
    let value = props.value
    let helperText = props.helperText
    let errorText = props.errorText
    let isVerifying = props.isVerifying

    var isRequired 
    if (props.isRequired) {
        isRequired = props.isRequired
    } else {
        isRequired = false
    }

    if (props.dateformat) {
        if (value) {
            value = new Date(value)
        }
    }

    return (
        <>
            <FormControl isRequired={isRequired} isInvalid={!props.verified && value && !isVerifying} pt={5} width={props.width}>
                <FormLabel>{title}</FormLabel> 
                <InputGroup>
                {props.dateformat ? 
                    <props.DatePicker
                    showPopperArrow={true}
                    isClearable={true}
                    dateFormat="MMM dd yyyy 00:00:00"
                    selected={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    /> : 
                    <Input 
                    onChange={onChange}
                    placeholder={placeholder}
                    value={value}
                    onBlur={onBlur}
                    
                />}
                {(props.verified && !props.dateformat && !isVerifying) && <InputRightElement children={<CheckCircleIcon color="#7879F1"/>} />}
                {/* {props.dateformat && <InputRightElement children={<IconButton aria-label='Search database' icon={<CalendarIcon />} />} />} */}
                {props.dateformat && <InputRightElement children={<CalendarIcon color="#2D3748"/>} />}
                </InputGroup>
                <FormErrorMessage textAlign="left" fontSize="16px">{errorText}</FormErrorMessage>
                {helperText &&
                    <FormHelperText textAlign="left" fontSize="16px" >{helperText}</FormHelperText>
                }
            </FormControl>
        </>
    )
}

export function MakeDealFormNumberItem(props) {
    let title = props.title
    let colSpan = props.colSpan
    let onChange = props.onChange
    let placeholder = props.placeholder
    let helperText = props.helperText
    let errorText = props.errorText
    let value = props.value
    let precision = props.precision
    var isRequired 
    if (props.isRequired) {
        isRequired = props.isRequired
    } else {
        isRequired = false
    }

    return (
        <>
            <FormControl isRequired={isRequired} isInvalid={!props.verified && isRequired && value} pt={5} width={props.width}>
                <FormLabel>{title}</FormLabel> 
                
                
                <NumberInput 
                    value={value} 
                    step={0.1} 
                    min={0}
                    max={props.maxvalue}
                    onChange={onChange}
                    placeholder={placeholder}
                    isDisabled={props.disabled}
                    precision={precision}
                >
                    <NumberInputField />
                    {(props.appendChar) && 
                        <InputRightElement ml={((value.length) * 8.6 + 10) + "px"} mr={2} children={<Text variant="dealInputAppendix">{props.appendChar}</Text>} />}
                </NumberInput>
                
                <FormErrorMessage textAlign="left" fontSize="16px">{errorText}</FormErrorMessage>
                {helperText &&
                    <FormHelperText textAlign="left" fontSize="16px" >{helperText}</FormHelperText>
                }
            </FormControl>
        </>
    )
}

export default MakeDealForm;
