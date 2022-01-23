import React, { useEffect, useMemo, useState, useContext } from "react";

import { Flex, Box, VStack, Wrap, WrapItem, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Center } from "@chakra-ui/react";

import { RoundNumbers, Symbols } from "../../Utils/ComponentUtils";

import { APP_ID, SERVER_URL } from "../../App";
import { useMoralis } from "react-moralis";
import DatabaseService from "../../Services/DatabaseService";
import { NetworkContext } from "../../Contexts/NetworkContext";
import NFTCard from "../../ReusableComponents/NFTCard";

const DummyData = [
  {
    deal: "CryptoPunk #1191",
    dealStartup: "CryptoPunk",

    investments: [
      {
        dealName: "CardStellar Series A",
        dealCreator: {
          name: "Alpha Capital",
          isVerified: true,
        },
        myInvestmentAmount: 1500,
        status: "Claimed",
        address: "0x4ea4e3621adb7051666958c6afe54f6db1a37d83",
      },
      {
        dealName: "CardStellar Series A",
        dealCreator: {
          name: "Alpha Capital",
          isVerified: true,
        },
        myInvestmentAmount: 20000,
        status: "Claimed",
        address: "0x4ea4e3621adb7051666958c6afe54f6db1a37d83",
      },
    ],
  },
  {
    deal: "CryptoPunk #1192",
    dealStartup: "CryptoPunk",
    investments: [
      {
        dealName: "PogCoin Seed Round",
        dealCreator: {
          name: "VC Fund",
          isVerified: false,
        },
        myInvestmentAmount: 100000,
        status: "Claimable",
        address: "0x4ea4e3621adb7051666958c6afe54f6db1a37d83",
      },
      {
        dealName: "CardStellar Series B",
        dealCreator: {
          name: "Alpha Capital",
          isVerified: true,
        },
        myInvestmentAmount: 20000,
        status: "Claimed",
        address: "0x4ea4e3621adb7051666958c6afe54f6db1a37d83",
      },
    ],
  },
];

const AccountInvestments = ({ userAddress = "" }) => {
  const [NFTs, setNFTs] = useState([]);

  const dataInvestment = useMemo(() => DummyData, []);

  const { Moralis, user } = useMoralis();

  const {selectedNetworkChainId} = useContext(NetworkContext)

  useEffect(() => {
    async function testnetNFTs() {
      if (!user) {
        return
      }
      try {
        const networkUser = await DatabaseService.getUser(user.get("ethAddress"))
        const result = await networkUser.getInvestments(selectedNetworkChainId)
        console.log(result)
        setNFTs(result);
      } catch (err) {
        console.log(err);
      }
    }
    testnetNFTs();
  }, [user]);

  return (
    <VStack w="full" h="full" p={0} alignItems="flex-start">
      <Flex>
        <Box textStyle="investmentMessages" mb={3} mr={2}>
          Your wallet holds the following NFTs:
        </Box>
      </Flex>
      <Wrap spacing="45px">
        {NFTs.map((item, index) => (
          <WrapItem key={index}>
            <NFTCard nftName={item.name} nftSymbol={item.symbol} nftMetadata={item.metadata} />
          </WrapItem>
        ))}
      </Wrap>
    </VStack>
  );
};

export default AccountInvestments;

