import React, { useEffect, useMemo, useContext, useState } from "react";
import { Flex, Box, VStack, Wrap, WrapItem, Table, Thead, Tbody, Tr, Th, Td, Badge } from "@chakra-ui/react";
import { TimeDeadline, RoundNumbers, Symbols, NFTName } from "../Utils/ComponentUtils";
import {useHistory} from "react-router-dom"



export default function DealCard(props) {

    // dealMetadata: DealMetadata
    const dealMetadata = props.dealMetadata

    const isPending = dealMetadata.isPending()
    const dealName = `${dealMetadata.getName()} ${isPending ? "(Pending)": ""}`
    const managerName = dealMetadata.getManager().getName()
    const isVerified = dealMetadata.getManager().getVerifiedStatus()
    const nftAddress = dealMetadata.getNftAddress()
    const minInvestmentAmount = dealMetadata.getMinInvestmentAmt()
    const paymentTokenAddress = dealMetadata.getInvestorPaymentToken()
    const deadline = dealMetadata.getInvestmentDeadline()
    const dealAddress = dealMetadata.getAddress()

    const history = useHistory()

    function clickHandler() {
        history.push(`/dealDetails?address=${dealAddress}`)
    }
    

    return (
        <Box layerStyle="dealTableWrap" onClick={clickHandler} cursor="pointer">
            <Box textStyle="titleDeal">{dealName}</Box>
            <Flex>
                <Box textStyle="subTitleDeal">{managerName}</Box>
                {isVerified && (
                    <Box ml={2}>
                    <Badge variant="verified">VERIFIED</Badge>
                    </Box>
                )}
            </Flex>

            <Box mt={25}>
                <Table variant="dealTable">
                    <Thead>
                    <Tr>
                        <Th>Required NFT</Th>
                        <Th>Min invest</Th>
                        <Th>Deadline</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    <Tr>
                        <Td>
                        <NFTName address={nftAddress} />
                        </Td>
                        <Td>
                        <RoundNumbers num={minInvestmentAmount} /> <Symbols address={paymentTokenAddress} />
                        </Td>
                        <Td>
                        <TimeDeadline deadline={deadline} />
                        </Td>
                    </Tr>
                    </Tbody>
                </Table>
            </Box>
        </Box>
    )

}

