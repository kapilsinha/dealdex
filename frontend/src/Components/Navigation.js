import React, { useState, useMemo, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Button, Wrap, WrapItem, Box, HStack, MenuButton, MenuList, MenuItem, Menu, useToast } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ReactComponent as Logo } from "../assets/icon/DealDevLogoSmall.svg";
import { ConvertAddress } from '../Utils/ComponentUtils';

import { APP_ID, SERVER_URL } from "../App";
import { useMoralis } from "react-moralis";

const CHAIN_NETWORK = [
  {
    name: "Ethereum",
    preFix: "eth",
  },
  {
    name: "Binance Smart Chain",
    preFix: "bsc",
  },
  {
    name: "Polygon (Matic)",
    preFix: "polygon",
  },
  {
    name: "Solana",
    preFix: "sol",
  },
  {
    name: "Elrond",
    preFix: "erd",
  },
];

const SIGN_MESSAGE = "Wellcome to DealDex";

function Navigation() {
  const [network, setNetWork] = useState("eth");
  const [userAddress, setUserAddress ] = useState(null);
  const [loading, setLoading ] = useState(false);
  const { Moralis } = useMoralis();
  const toast = useToast();
  const history = useHistory();

  const dataNetwork = useMemo(() => CHAIN_NETWORK, []);

  const onSelectNetWork = (network) => {
    setNetWork(network.preFix);
  };

  const getNameNetwork = (preFix) => {
    const network = dataNetwork.find((i) => i.preFix === preFix);
    return network ? network.name : "";
  };

  useEffect(() => {
    Moralis.start({ serverUrl: SERVER_URL, appId: APP_ID });

    const currentUser = Moralis.User.current();
    if(currentUser) {
      const authData = Object.values(currentUser.get("authData"))[0];
      setUserAddress(authData.id)
    }
  }, []);

  const onLogin = async () => {
    setLoading(true)
    try {
      const user = await Moralis.authenticate({ type: network, signingMessage: SIGN_MESSAGE });
      const authData = Object.values(user.get("authData"))[0];
      setUserAddress(authData.id)
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
    await Moralis.User.logOut()
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
                {getNameNetwork(network)} <ChevronDownIcon />
              </MenuButton>
              <MenuList>
                {dataNetwork.map((network, index) => (
                  <MenuItem key={index} value={network.preFix} onClick={() => onSelectNetWork(network)}>
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
