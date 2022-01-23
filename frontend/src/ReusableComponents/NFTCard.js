import React, { useEffect, useMemo, useContext, useState } from "react";

import { Flex, Box, VStack, Wrap, WrapItem, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Center } from "@chakra-ui/react";

import { TimeDeadline, RoundNumbers, Symbols, NFTName } from "../Utils/ComponentUtils";


export default function NFTCard(props) {

    // dealMetadata: DealMetadata

    const nftCollection = props.nftName
    const nftSymbol = props.nftSymbol
    const nftMetadata = props.nftMetadata

    const nftName = `${nftSymbol} #${nftMetadata.getNftId()}`
    

    return (
        <Box layerStyle="dealTableWrap" pb="12px" pt="40px">
            <Box textStyle="titleInvestment">{nftName}</Box>
            <Flex wrap>
                <Box textStyle="subTitleInvestment">{nftCollection}</Box>
            </Flex>
            {/* <InvestmentsItems key={index} data={item.investments} /> */}
        </Box>
    )

}

const InvestmentsItems = ({ data = [] }) => {
    const [checkedItem, setCheckedItem] = useState(true);
  
    return (
      <>
        {data.map((item, index) => (
          <Box my={18} key={index}>
            <Box my={1} textStyle="titleInvestmentDeal">
              {item.dealName}
            </Box>
            <Table variant="dealTable">
              <Thead>
                <Tr>
                  <Th>Created By</Th>
                  <Th>My investment </Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Flex pos="relative">
                      <Center>{item.dealCreator.name}</Center>
                      {item.dealCreator.isVerified && (
                        <Box pos="absolute" layerStyle="checkboxVerifyWrap">
                          <Checkbox ml={1} isChecked={checkedItem} onChange={(e) => setCheckedItem(true)} />
                        </Box>
                      )}
                    </Flex>
                  </Td>
                  <Td>
                    <RoundNumbers num={item.myInvestmentAmount} /> <Symbols address={item.address} />
                  </Td>
                  <Td>
                    <Box color={item.status === "Claimable" ? "green.500" : "gray.700"}>{item.status}</Box>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        ))}
      </>
    );
  };
  

