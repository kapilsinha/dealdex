import { useState, useEffect } from "react";
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

export default function DealDexTextForm(props) {
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

