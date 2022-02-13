import { useState, useEffect, useContext } from "react";
import { 
    useDisclosure,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    ModalFooter,
    useToast
} from "@chakra-ui/react";
import DealDexTextForm from "../../../ReusableComponents/DealDexTextForm"
import DealDexNumberForm from "../../../ReusableComponents/DealDexNumberForm"
import DealDexMultilineTextForm from "../../../ReusableComponents/DealDexMultilineTextForm"
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"
import {NetworkContext} from "../../../Contexts/NetworkContext"
import SmartContractService from "../../../Services/SmartContractService"
import  {useMoralis} from "react-moralis"
import {ExchangeRate, DealToken} from "../../../DataModels/DealConfig"


export default function UpdateDealDescriptionModal(props) {

    const {dealConfig, dealMetadata} = useContext(DealDetailsContext)
    const [newDescription, setNewDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    function buttonIsEnabled() {
        return dealMetadata
    }

    async function updateDescription() {
        setIsLoading(true)
        await dealMetadata.updateDealDescription(newDescription)
        toast({
            title: "Successfuly updated deal description",
            status: "success",
            isClosable: true,
            position: "bottom-right",
        });
        setIsLoading(false)
        onClose()
    }

    return(
        <>
            <Button variant="dealDetailTable" onClick={() => {
                onOpen()
            }}>Edit Description</Button>


            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Update Description</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <DealDexMultilineTextForm 
                        title="New Description"
                        colSpan={2}
                        onChange = {e => setNewDescription(e.target.value)}
                        placeholder = ""
                        value = {newDescription}
                        width="100%"
                        onBlur = {e => setNewDescription(e.target.value.trim())}
                        isRequired = {true}
                        verified = {newDescription}
                        helperText = "Update the deal description"
                    />
                </ModalBody>

                <ModalFooter>
                    <Button variant="dealDetailTable" isDisabled={!buttonIsEnabled()} onClick={updateDescription} isLoading={isLoading}  mr={3}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}