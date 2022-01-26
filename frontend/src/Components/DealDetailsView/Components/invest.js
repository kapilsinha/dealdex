
import {useEffect, useState, useContext} from 'react';
import { Select, VStack, HStack, Heading, Container, Center, Button, useToast } from '@chakra-ui/react';
import {MakeDealFormNumberItem} from '../index'
import { useMoralis } from "react-moralis";
import {APP_ID, SERVER_URL} from "../../../App";
import DealDexNumberForm from "../../../ReusableComponents/DealDexNumberForm"
import {DealDetailsContext} from "../../../Contexts/DealDetailsContext"
import SmartContractService from "../../../Services/SmartContractService"


function Invest(props) {
    
    const toast = useToast();

    const {dealConfig, validNfts, dealMetadata} = useContext(DealDetailsContext)  
    const {user} = useMoralis()

    const [investAmt, setInvestAmt] = useState("0")
    const [nftId, setNftId] = useState(undefined)
    const [fees, setFees] = useState("0")
    const [expectedTokens, setExpectedTokens] = useState(0)

    var minInvestPerNft = 0
    var maxInvestPerNft = 0


    async function invest() {
        const tokenBitsAmount = dealConfig.exchangeRate.paymentToken.getTokenBits(investAmt)
        const dealAddress = dealMetadata.getAddress()
        const paymentTokenAddress = dealConfig.exchangeRate.paymentToken.contractAddress
        const result = await SmartContractService.invest(dealAddress, paymentTokenAddress, tokenBitsAmount, nftId, user)

        if (result.error) {
            toast({
                title: result.error,
                status: "error",
                isClosable: true,
                position: "bottom-right",
            });
        } else {
            toast({
                title: "Successfully invested",
                status: "success",
                isClosable: true,
                position: "bottom-right",
            });
        }
    }

    const buttonIsEnabled = dealMetadata && dealConfig && validNfts && investAmt && nftId && user
    if (dealConfig) {
        const paymentToken = dealConfig.exchangeRate.paymentToken
        minInvestPerNft = Number(paymentToken.getTokens(dealConfig.investConfig.minInvestmentPerInvestor))
        maxInvestPerNft = Number(paymentToken.getTokens(dealConfig.investConfig.maxInvestmentPerInvestor))
    }

    useEffect(() => {
        if (dealConfig) {
            const dealDexFeesBps = (dealConfig.claimFundsConfig.dealdexFeeBps + dealConfig.claimTokensConfig.dealdexFeeBps)
            const syndicateFeesBps = (dealConfig.claimFundsConfig.managerFeeBps + dealConfig.claimTokensConfig.managerFeeBps)
            const totalFeesBps = dealDexFeesBps + syndicateFeesBps
            const totalFees = Number(investAmt) * totalFeesBps * 0.0001

            const exchangeRate = Number(dealConfig.exchangeRate.displayValue)
            const tokensAmt = (Number(investAmt) - totalFees) / exchangeRate

            const paymentToken = dealConfig.exchangeRate.paymentToken

            setFees(`${totalFees} ${paymentToken.symbol}`)
            setExpectedTokens(`${tokensAmt}`)
        }
    }, [investAmt])
    

    return (
        <Container>
            <Select placeholder='Select your NFT' onChange={(e) => setNftId(e.target.value)}>
                {
                    validNfts.map((nft, index)=>{
                        return (
                            <option value={nft.token_id} key={nft.token_id}>{`${nft.symbol} #${nft.token_id}`}</option>
                        );
                    })
                }
            </Select>
            <DealDexNumberForm 
                title="Amount to invest"
                colSpan={2}
                onChange = {value => setInvestAmt(value)}
                value = {investAmt}
                width="100%"
                appendChar = {dealConfig ? dealConfig.exchangeRate.paymentToken.symbol : ""}
                isRequired = {false}
                disabled = {false}
                precision = {2}
                min={minInvestPerNft}
                max={maxInvestPerNft}
            />
            <HStack >
                <Heading size="sm" py="3px" w="full" textAlign="left">Fees:</Heading>
                <Heading size="sm" py="3px" w="full" textAlign="right">{fees}</Heading>
            </HStack>
            <HStack pb={3}>
                <Heading size="sm" py="3px" w="full" textAlign="left">Expected tokens:</Heading>
                <Heading size="sm" py="3px" w="full" textAlign="right">{expectedTokens}</Heading>
            </HStack>
            <Center>
                <Button variant="dealDetailTable" isDisabled={!buttonIsEnabled} onClick={invest}>
                    Invest
                </Button>
            </Center>
        </Container>
    )
}

export default Invest;
