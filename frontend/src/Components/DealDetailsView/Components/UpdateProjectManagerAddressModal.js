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


export default function UpdateProjectManagerModal(props) {

    const setProjectAddress = props.setProjectAddress;
    const setManagerAddress = props.setManagerAddress;

    const {dealConfig, dealMetadata} = useContext(DealDetailsContext)
    const {selectedNetworkChainId} = useContext(NetworkContext)
    const {user} = useMoralis()
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [localProjectAddress, setLocalProjectAddress] = useState("")
    const [localManagerAddress, setLocalManagerAddress] = useState("")
    
    useEffect(() => {
        console.log("test")
        setLocalProjectAddress(props.projectAddress)
        setLocalManagerAddress(props.managerAddress)
    }, [props.projectAddress, props.managerAddress])

    function buttonIsEnabled() {
        return dealConfig.participantAddresses.projectAddress == dealConfig.participantAddresses.managerAddress
            && SmartContractService.getChecksumAddress(localManagerAddress) !== undefined
            && SmartContractService.getChecksumAddress(localProjectAddress) !== undefined
    }

    function updateAddresses() {
        setProjectAddress(SmartContractService.getChecksumAddress(localProjectAddress))
        setManagerAddress(SmartContractService.getChecksumAddress(localManagerAddress))
        onClose()
    }

    return(
        <>
            <Button variant="dealDetailTable" onClick={() => {
                onOpen()
            }}>Update</Button>


            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Update Project & Manager Address</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <DealDexTextForm 
                        title="Project Address"
                        colSpan={2}
                        onChange = {e => setLocalProjectAddress(e.target.value)}
                        value = {localProjectAddress}
                        width="100%"
                        onBlur = {e => setLocalProjectAddress(e.target.value.trim())}
                        verified = {SmartContractService.getChecksumAddress(localProjectAddress) !== undefined}
                        isRequired = {true}
                        helperText = "The project address that will receive the funds."
                        errorText = "Enter a valid address."
                    />

                    <DealDexTextForm 
                        title="Syndicate Manager Address"
                        colSpan={2}
                        onChange = {e => setLocalManagerAddress(e.target.value)}
                        value = {localManagerAddress}
                        width="100%"
                        onBlur = {e => setLocalManagerAddress(e.target.value.trim())}
                        verified = {SmartContractService.getChecksumAddress(localManagerAddress) !== undefined}
                        isRequired = {true}
                        helperText = "The manager address that will receive the syndication fee."
                        errorText = "Enter a valid address."
                    />
                </ModalBody>

                <ModalFooter>
                    <Button variant="dealDetailTable" isDisabled={!buttonIsEnabled()} onClick={updateAddresses} mr={3}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}