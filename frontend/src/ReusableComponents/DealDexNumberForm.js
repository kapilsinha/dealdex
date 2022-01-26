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

export default function DealDexNumberForm(props) {
    let title = props.title
    let colSpan = props.colSpan
    let onChange = props.onChange
    let placeholder = props.placeholder
    let helperText = props.helperText
    let errorText = props.errorText
    let value = props.value
    let precision = props.precision
    let min = props.min
    let max = props.max
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
                    min={min}
                    max={max}
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