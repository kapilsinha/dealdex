import React, { useState, useMemo, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Button, Wrap, WrapItem, Box, HStack, MenuButton, MenuList, MenuItem, Menu, useToast } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ReactComponent as Logo } from "../assets/icon/DealDevLogoSmall.svg";
import { ConvertAddress } from '../Utils/ComponentUtils';

import { APP_ID, SERVER_URL } from "../App";
import { useMoralis } from "react-moralis";
import AuthService from "../Services/AuthService";
import Network from "../DataModels/Network";

const chainNetworks = [
  new Network(1, "Ethereum"),
  new Network(80001, "Mumbai"),
  new Network(1337, "Localhost")
];


function Navigation() {
  const [networkIndex, setNetworkIndex] = useState(0);
  const [userAddress, setUserAddress ] = useState(null);
  const [loading, setLoading ] = useState(true);
  const moralisContext = useMoralis();
  const toast = useToast();
  const history = useHistory();
  const [walletChain, setWalletChain] = useState(1)


  const onSelectNetWork = (index) => {
    AuthService.switchNetwork(moralisContext, chainNetworks[index])
    setNetworkIndex(index);
  };

  async function showChangeNetworkAlertIfNeeded() {
    let currentWalletChain = await AuthService.getWalletChain(moralisContext)

    let selectedNetwork = chainNetworks[networkIndex]

    if (currentWalletChain && (currentWalletChain != selectedNetwork.chainId)) {
      alert("Change your network to " + selectedNetwork.name)
    }
  }

  useEffect(() => {

    async function checkUser() {

      await AuthService.initializeMoralis(moralisContext)
      const currentUser = await AuthService.getCurrentUser(moralisContext)
      if (currentUser) {
        setUserAddress(currentUser.address)
      }
      setLoading(false)

      
    }

    checkUser()


    showChangeNetworkAlertIfNeeded()

    const unsubscribe = AuthService.observeWalletChain(moralisContext, (walletChain) => {
      setWalletChain(walletChain)
    })

    return unsubscribe
  }, []);

  useEffect(() => {
    showChangeNetworkAlertIfNeeded()
  }, [walletChain])

  const onLogin = async () => {
    setLoading(true)
    try {

      await AuthService.login(moralisContext)
      const user = await AuthService.getCurrentUser(moralisContext)
      setUserAddress(user.address)
      toast({
        title: "Connect Wallet Success",
        status: "success",
        isClosable: true,
        position: "bottom-right",
      });
      setLoading(false)
    } catch (err) {
      toast({
        title: err.message,
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
      setLoading(false)
    }
  };

  const onDisconnect = async () => {
    setLoading(true)
    await AuthService.logout(moralisContext)
    setUserAddress(null)
    toast({
      title: "Disconnect Wallet Success",
      status: "success",
      isClosable: true,
      position: "bottom-right",
    });
    setLoading(false)
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
                {chainNetworks[networkIndex].name} <ChevronDownIcon />
              </MenuButton>
              <MenuList>
                {chainNetworks.map((network, index) => (
                  <MenuItem key={index} value={network.name} onClick={() => onSelectNetWork(index)}>
                    {network.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </WrapItem>
          { userAddress ? (
            <WrapItem>
              <Menu variant="selectNetWork" autoSelect={false}>
                <MenuButton isLoading={loading} variant="addresstWallet" size="lg" as={Button} px={4} py={2}>
                  <ConvertAddress address={userAddress} />{}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => history.push("/account")}> Accounts </MenuItem>
                  <MenuItem onClick={ onDisconnect }> Disconnect </MenuItem>
                </MenuList>
              </Menu>
            </WrapItem>
          ) : (
            <WrapItem>
              <Button variant="connectWallet" size="lg" isLoading={loading} onClick={onLogin}>
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
