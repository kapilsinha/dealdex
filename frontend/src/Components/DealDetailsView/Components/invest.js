import { Select, VStack, HStack, Heading, Container } from '@chakra-ui/react';
import {MakeDealFormNumberItem} from '../index'
import { useEffect, useState } from 'react';
import { useMoralis } from "react-moralis";
import {APP_ID, SERVER_URL} from "../../../App";
import DealDexNumberForm from "../../../ReusableComponents/DealDexNumberForm"

function Invest(props) {
    const { Moralis, } = useMoralis();
    const [nfts, setNFTs] = useState([]);
    useEffect(()=>{
        Moralis.start({ serverUrl: SERVER_URL, appId: APP_ID });  
        // getUseNFTs().then((nfts) => {  
        //     console.log(nfts.result);          
        //     setNFTs(nfts.result);
        // })
    }, []);
    async function getUseNFTs() {
        //Get metadata for one token
        const options = { q: "Pancake", chain: "bsc", filter: "name", limit: 4 };
        const NFTs = await Moralis.Web3API.token.searchNFTs(options);
        return NFTs;
    }
    async function getNFTMetadata(tokenAddress) {
        //Get metadata for one token
        const options = { chain: "bsc", addresses: tokenAddress };
        const tokenMetadata = await Moralis.Web3API.token.getNFTMetadata(options);
        return tokenMetadata;
    }

    return (
        <Container>
            <VStack py="5" spacing="1">
                <Select placeholder='Select your NFT'>
                    {
                        nfts.map((nft, index)=>{
                            getNFTMetadata(nft.token_address).then((metadata) => {
                                return (
                                    <option value={index}>{metadata[0].symbol}</option>
                                );
                            });
                        })
                    }
                </Select>
            </VStack>
            <DealDexNumberForm 
                title="Amount to invest"
                colSpan={2}
                onChange = {value => console.log(value)}
                value = {0}
                width="100%"
                appendChar = {"USDC"}
                isRequired = {false}
                disabled = {false}
            />
            <HStack pb={3}>
                <Heading size="sm" py="3px" w="full" textAlign="left">Expected tokens:</Heading>
                <Heading size="sm" py="3px" w="full" textAlign="right">{"0"}</Heading>
            </HStack>
        </Container>
    )
}

export default Invest;
