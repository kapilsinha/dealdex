import {useState, useContext} from 'react';
import {Deal} from '../../DataModels/DealData';
import {
    FormControl,
    FormHelperText,
    FormLabel,
    GridItem,
    Input,
    VStack,
    Button,
    Text
  } from '@chakra-ui/react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {MakeDealFormContext} from '../../Contexts/MakeDealFormContext'
import {MakeDealFormItem, MakeDealFormNumberItem} from './index';


function DealFormStep1(props) {

    const {incrementStep, dealName, setDealName} = useContext(MakeDealFormContext)

    const [dealData, setDealData] = useState(Deal.empty());

    const formatInput = (event) => {
        setDealName(event.target.value.trim())
    }    

    function inputIsVerified() {
        return dealName
    }

    return (

        <GridItem colSpan={2} >
            <VStack w="full" h="full" spacing={10} alignItems="flex-start">
                <VStack spacing={1} alignItems="flex-start">
                    <Text fontSize="32px" fontWeight="bold">Deal Name</Text>
                    <Text>Enter a name for your deal. This is the name that will be visible on the front page.</Text>
                </VStack>
            </VStack>  
            <MakeDealFormItem 
                title="Deal Name"
                colSpan={2}
                onChange = {e => setDealName(e.target.value)}
                placeholder = "Name of investment deal"
                value = {dealName}
                onBlur = {e => formatInput(e)}
                isRequired = {true}
                verified = {inputIsVerified()}
            />
            <VStack w="full" h="full" pt={20} spacing={10} alignItems="flex-start">
                <Button variant="dealForm2Details" size='lg' onClick={incrementStep} disabled = {!inputIsVerified()}>Continue to investment constraints</Button>
            </VStack>
        </GridItem>
    )
}


export default DealFormStep1;
