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


export default function InvestModal(props) {

    const {dealConfig, dealMetadata} = useContext(DealDetailsContext)
    const {selectedNetworkChainId} = useContext(NetworkContext)
    const {user} = useMoralis()
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [projectTokenAddress, setProjectTokenAddress] = useState("")
    const [projectTokenPrice, setProjectTokenPrice] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const paymentToken = dealConfig ? dealConfig.exchangeRate.paymentToken : undefined

    const projectTokenMetadata = undefined
    const projectTokenMetadataIsLoading = true

    const paymentTokenMetadata = undefined

    function buttonIsEnabled() {
        return projectTokenAddress && projectTokenPrice && dealConfig && dealMetadata && user
    }

    async function updateToken() {
        setIsLoading(true)
        const dealAddress = dealMetadata.getAddress()
        const projectToken = await DealToken.fromContractAddress(projectTokenAddress, selectedNetworkChainId)
        if (!projectToken) {
            setIsLoading(false)
            toast({
                title: "Invalid project token address",
                status: "error",
                isClosable: true,
                position: "bottom-right",
            });
        }
        const exchangeRate = await ExchangeRate.fromDisplayValue(projectTokenPrice, paymentToken, projectToken)
        if (!exchangeRate) {
            setIsLoading(false)
            toast({
                title: "Invalid price",
                status: "error",
                isClosable: true,
                position: "bottom-right",
            });
        }
        const result = await SmartContractService.updateProjectToken(dealAddress, projectTokenAddress, exchangeRate, user) 
        if (result.error) {
            toast({
                title: result.error,
                status: "error",
                isClosable: true,
                position: "bottom-right",
            });
        } else {
            toast({
                title: "Successfuly updated project token",
                status: "success",
                isClosable: true,
                position: "bottom-right",
            });
        }
        setIsLoading(false)
        onClose()
    }

    return(
        <>
            <Button variant="dealDetailTable" onClick={() => {
                onOpen()
            }}>Invest</Button>


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
                        title="Project Token"
                        colSpan={2}
                        onChange = {e => setProjectTokenAddress(e.target.value)}
                        placeholder = "ERC-20 Token Contract Address"
                        value = {projectTokenAddress}
                        width="100%"
                        onBlur = {e => setProjectTokenAddress(e.target.value.trim())}
                        verified = {(projectTokenMetadata !== undefined)}
                        isVerifying = {projectTokenMetadataIsLoading}
                        isRequired = {true}
                        helperText = "The project’s token which will be distributed to investors."
                        errorText = "Enter a valid ERC-20 token contract address."
                    />

                    <DealDexNumberForm 
                        title="Project Token Price"
                        colSpan={2}
                        onChange = {value => setProjectTokenPrice(value)}
                        value = {projectTokenPrice}
                        width="100%"
                        appendChar = {paymentToken ? paymentToken.symbol : ""}
                        isRequired = {true}
                        verified = {projectTokenPrice != ""}
                        helperText = "The price of the project’s token."
                    />
                </ModalBody>

                <ModalFooter>
                    <Button variant="dealDetailTable" isDisabled={!buttonIsEnabled()} onClick={updateToken} isLoading={isLoading}  mr={3}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}