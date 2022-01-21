import React, { useState, useMemo, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { Button, Wrap, WrapItem, Box, HStack, MenuButton, MenuList, MenuItem, Menu, useToast } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ReactComponent as Logo } from "../assets/icon/DealDevLogoSmall.svg";
import { ConvertAddress } from '../Utils/ComponentUtils';

import { APP_ID, SERVER_URL } from "../App";
import { useMoralis } from "react-moralis";
import Network from "../DataModels/Network";
import {NetworkContext} from "../Contexts/NetworkContext"
import AuthStrings from "../Strings/AuthStrings"

function Navigation() {
  const {Moralis, user, isUserUpdating, isAuthenticating, isAuthenticated, authenticate, logout} = useMoralis();
  const toast = useToast();
  const history = useHistory();

  const {selectedNetworkName, selectedNetworkChainId, allNetworkNames, setNetworkIndex, walletChain } = useContext(NetworkContext)

  useEffect(() => {
    if (walletChain && (walletChain != selectedNetworkChainId)) {
      toast({
        title: "Change your network to " + selectedNetworkName,
        status: "error",
        isClosable: false,
        position: "top"
      })
    }
  }, [walletChain, selectedNetworkChainId])

  const onLogin = async () => {
    try {

      await authenticate({ signingMessage: AuthStrings.signingMessage })

      toast({
        title: "Connect Wallet Success",
        status: "success",
        isClosable: true,
        position: "bottom-right",
      });
    } catch (err) {
      toast({
        title: err.message,
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const onDisconnect = async () => {
    await logout()
    toast({
      title: "Disconnect Wallet Success",
      status: "success",
      isClosable: true,
      position: "bottom-right",
    });
  }


  return (
    <Box layerStyle="navWrap">
      <Box layerStyle="cursorWrap" onClick={() => history.push("/")}>
        <HStack>
          <Logo />
          <Box textStyle="titleDeal" color="gray.800">
            DealDex
          </Box>
        </HStack>
      </Box>

      <Box>
        <Wrap spacing="30px" align="center">
          <WrapItem>
            <Box layerStyle="cursorWrap" onClick={() => history.push("/")}>
              Explore deals
            </Box>
          </WrapItem>
          <WrapItem>
            <Box layerStyle="cursorWrap" onClick={() => history.push("/createDeal")}>
              Create a deal
            </Box>
          </WrapItem>
          <WrapItem>
            <Menu variant="selectNetWork" autoSelect={false}>
              <MenuButton px={4} py={2}>
                {selectedNetworkName} <ChevronDownIcon />
              </MenuButton>
              <MenuList>
                {allNetworkNames.map((networkName, index) => (
                  <MenuItem key={index} value={networkName} onClick={() => setNetworkIndex(index) }>
                    {networkName}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </WrapItem>
          { isAuthenticated ? (
            <WrapItem>
              <Menu variant="selectNetWork" autoSelect={false}>
                <MenuButton isLoading={isAuthenticating} variant="addresstWallet" size="lg" as={Button} px={4} py={2}>
                  <ConvertAddress address={user.get('ethAddress')} />{}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => history.push("/account")}> Accounts </MenuItem>
                  <MenuItem onClick={ onDisconnect }> Disconnect </MenuItem>
                </MenuList>
              </Menu>
            </WrapItem>
          ) : (
            <WrapItem>
              <Button variant="connectWallet" size="lg" isLoading={isAuthenticating} onClick={onLogin}>
                Connect Wallet
              </Button>
            </WrapItem>
          )}
        </Wrap>
      </Box>
    </Box>
  );
}

export default Navigation;
