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
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"
import {NetworkContext} from "../../../Contexts/NetworkContext"
import DatabaseService from "../../../Services/DatabaseService"
import SmartContractService from "../../../Services/SmartContractService"
import  {useMoralis} from "react-moralis"
import ContactInfo from "../../../DataModels/ContactInfo"


export default function InvestModal(props) {

    const {dealConfig, dealMetadata} = useContext(DealDetailsContext)
    const {selectedNetworkChainId} = useContext(NetworkContext)
    const {user} = useMoralis()
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)

    const [startInvestButtonEnabled, setStartInvestButtonEnabled] = useState(false)
    const [investAmt, setInvestAmt] = useState(0)
    const [currentUser, setCurrentUser] = useState(null)
    const [nftId, setNftId] = useState(0)

    const [email, setEmail] = useState("")
    const [telegramUsername, setTelegramUsername] = useState("")
    const [discordUsername, setDiscordUsername] = useState("")

    useEffect(async () => {
        if (!user) {
            return
        }
        if (!currentUser) {
            setCurrentUser(await DatabaseService.getUser(user.get("ethAddress")))
        }
        if (currentUser) {
            let contactInfo = await currentUser.getContactInfo()
            if (contactInfo) {
                setEmail(contactInfo.getEmail() || "")
                setTelegramUsername(contactInfo.getTelegramUsername() || "")
                setDiscordUsername(contactInfo.getDiscordUsername() || "")
            }
        }
        setNftId(props.nftId)
        setInvestAmt(props.investAmt)
        setStartInvestButtonEnabled(props.startInvestButtonEnabled)
    }, [props.investAmt, props.nftId, props.startInvestButtonEnabled])

    function buttonIsEnabled() {
        return dealConfig && dealMetadata && user && (investAmt > 0) && isValidEmail(email)
    }

    async function invest() {
        await updateContactInfo()

        const tokenBitsAmount = dealConfig.exchangeRate.paymentToken.getTokenBits(investAmt)
        const dealAddress = dealMetadata.getAddress()
        const paymentTokenAddress = dealConfig.exchangeRate.paymentToken.contractAddress

        const signer = await SmartContractService.getSignerForUser(user)
        const allowance = await SmartContractService.getERC20Allowance(paymentTokenAddress, dealAddress, signer.getAddress(), selectedNetworkChainId)
        console.log("Allowance: ", allowance)

        if (allowance < tokenBitsAmount) {
            await approveAndInvest(dealAddress, paymentTokenAddress, tokenBitsAmount - allowance, user)
        } else {
            await investOnly(dealAddress, tokenBitsAmount, user)
        }
        onClose()
    }

    async function approveAndInvest(dealAddress, paymentTokenAddress, tokenBitsAmount, user) {
        const approveTxn = await SmartContractService.investApprove(dealAddress, paymentTokenAddress, tokenBitsAmount, user)
        if (approveTxn.error) {
            toast({
                title: approveTxn.error,
                status: "error",
                isClosable: true,
                position: "bottom-right",
            });
        } else {
            toast({
                title: "You're not done! You have approved your investment, but we have not collected any funds from you. Once your txn is processed (please wait up to a few minutes), we will prompt you to finish your investment",
                status: "info",
                isClosable: true,
                position: "bottom-right",
                duration: null
            });
            // The approval needs to finish before attempting to invest, otherwise investor has "insufficient allowance"
            await approveTxn.wait();
            toast.closeAll();
            await investOnly(dealAddress, tokenBitsAmount, user)
        }
    }

    async function investOnly(dealAddress, tokenBitsAmount, user) {
        let nftIdUsedToInvest = dealConfig.investConfig.gateToken ? nftId : 0
        const investResult = await SmartContractService.investTransfer(dealAddress, tokenBitsAmount, nftIdUsedToInvest, user)
        if (investResult.error) {
            toast({
                title: investResult.error,
                status: "error",
                isClosable: true,
                position: "bottom-right",
            });
        } else {
            toast({
                title: "Successfully invested!",
                status: "success",
                isClosable: true,
                position: "bottom-right",
            });
        }
    }

    async function updateContactInfo() {
        setIsLoading(true)
        console.log(currentUser)
        await currentUser.updateContactInfo(ContactInfo.createContactInfo(email, telegramUsername, discordUsername))
        setIsLoading(false)
    }

    function isValidEmail(emailAddress) {
        return emailAddress && emailAddress.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) != null
    }

    function isValidDiscordUsername(discordUsername) {
        return discordUsername != ""
    }

    function isValidTelegramUsername(telegramUsername) {
        return telegramUsername != ""
    }

    return(
        <>
            <Button variant="dealDetailTable" isDisabled={!startInvestButtonEnabled} onClick={() => {
                onOpen()
            }}>Invest</Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Invest</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <DealDexTextForm 
                        title="Email"
                        colSpan={2}
                        onChange = {e => setEmail(e.target.value)}
                        value = {email}
                        width="100%"
                        onBlur = {e => setEmail(e.target.value.trim())}
                        verified = {isValidEmail(email)}
                        isRequired = {true}
                        helperText = "Your email address, to be used for receipt of investment confirmation."
                        errorText = "Enter a valid email."
                    />

                    <DealDexTextForm 
                        title="Telegram Username"
                        colSpan={2}
                        onChange = {e => setTelegramUsername(e.target.value)}
                        value = {telegramUsername}
                        width="100%"
                        onBlur = {e => setTelegramUsername(e.target.value.trim())}
                        verified = {isValidTelegramUsername(telegramUsername)}
                        isRequired = {false}
                        helperText = "Your Telegram username"
                        errorText = "Enter a valid username."
                    />

                    <DealDexTextForm 
                        title="Discord Username"
                        colSpan={2}
                        onChange = {e => setDiscordUsername(e.target.value)}
                        value = {discordUsername}
                        width="100%"
                        onBlur = {e => setDiscordUsername(e.target.value.trim())}
                        verified = {isValidDiscordUsername(discordUsername)}
                        isRequired = {false}
                        helperText = "Your Discord username"
                        errorText = "Enter a valid username."
                    />
                </ModalBody>

                <ModalFooter>
                    <Button variant="dealDetailTable" isDisabled={!buttonIsEnabled()} onClick={invest} isLoading={isLoading}  mr={3}>
                        Invest
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}