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
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"
import {NetworkContext} from "../../../Contexts/NetworkContext"
import SmartContractService from "../../../Services/SmartContractService"
import  {useMoralis} from "react-moralis"
import {ExchangeRate, DealToken} from "../../../DataModels/DealConfig"


export default function EditVestingModal(props) {

    const {dealConfig, dealMetadata} = useContext(DealDetailsContext)
    const [newVestingDescription, setNewVestingDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    function buttonIsEnabled() {
        return dealMetadata
    }

    async function updateVesting() {
        setIsLoading(true)
        await dealMetadata.updateVestingDescription(newVestingDescription)
        toast({
            title: "Successfuly updated vesting schedule",
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
            }}>Edit Vesting</Button>


            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Update Project Token</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <DealDexTextForm 
                        title="New Vesting Schedule"
                        colSpan={2}
                        onChange = {e => setNewVestingDescription(e.target.value)}
                        placeholder = "Eg. 10% at TGE, 90% over 3 months"
                        value = {newVestingDescription}
                        width="100%"
                        onBlur = {e => setNewVestingDescription(e.target.value.trim())}
                        isRequired = {true}
                        verified = {newVestingDescription}
                        helperText = "Update the vesting schedule"
                    />
                </ModalBody>

                <ModalFooter>
                    <Button variant="dealDetailTable" isDisabled={!buttonIsEnabled()} onClick={updateVesting} isLoading={isLoading}  mr={3}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}