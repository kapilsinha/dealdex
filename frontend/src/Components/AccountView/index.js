import React, { useState, useEffect } from "react";
import { Flex, Container, Box, ButtonGroup, Button, HStack, VStack, Tabs, TabList, TabPanels, Tab, TabPanel, Input, FormControl, IconButton } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

import AccountInvestments from "./Investments";
import DealsUnderManagement from "./DealsUnderManagement";
import FundraisingDeals from "./FundraisingDeals"

import DatabaseService from "../../Services/DatabaseService";

import { ConvertAddress } from "../../Utils/ComponentUtils";

import { useMoralis } from "react-moralis";
import { useHistory, useLocation } from "react-router-dom"


function AccountView(props) {
  const [isEditUsername, setIsEditUsername] = useState(false);
  const [networkUser, setNetworkUser] = useState(undefined)
  const {user} = useMoralis()

  const search = useLocation().search
  var defaultTab = 0
  try {
    var defaultTabQueryParam = new URLSearchParams(search).get('defaultTab')
    var defaultTabQueryParam = Number(defaultTabQueryParam)
    if ([0,1,2].includes(defaultTabQueryParam)) {
      defaultTab = defaultTabQueryParam
    }
  } catch(error) {

  }
    

  useEffect(() => {
    async function fetchDeals() {
      if (!user) {
        return
      }

      try {
        let networkUser = await DatabaseService.getUser(user.get("ethAddress"));
        setNetworkUser(networkUser)
      } catch (err) {
        console.log(err);
      }
    }
    fetchDeals();
  }, [user]);

  return (
    <Container maxW="container.xl" p={0}>
      <Flex h={{ base: "auto", md: "100%" }} py={[0, 10, 20]} direction={{ base: "column-reverse", md: "row" }}>
        <VStack w="full" h="full" p={0} alignItems="flex-start">
          <Box>
            <HStack spacing="10px" alignItems="center">
              {isEditUsername ? (
                <EditUserInput networkUser={networkUser} setNetworkUser={setNetworkUser} setIsEditUsername={setIsEditUsername} />
              ) : (
                <>
                  <Box textStyle="account">{networkUser ? networkUser.getName(): ""}</Box>
                  {(networkUser !== undefined) &&
                    <Button variant="accountEdit" onClick={() => setIsEditUsername(true)}>
                      Edit
                    </Button>
                  }
                </>
              )}
            </HStack>
            <Box textAlign="left" textStyle="addressWallet">
              <ConvertAddress address={networkUser ? networkUser.getAddress(): ""} />
            </Box>
          </Box>

          <Box>
            <Tabs mt={50} defaultIndex={defaultTab}>
              <TabList>
                <Tab>My investments</Tab>
                <Tab ml={20}>Deals under management</Tab>
                <Tab ml={20}>My fundraising</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <AccountInvestments userAddress={"userAddress"} />
                </TabPanel>
                <TabPanel px={0}>
                  <DealsUnderManagement />
                </TabPanel>
                <TabPanel px={0}>
                  <FundraisingDeals />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Flex>
    </Container>
  );
}

export default AccountView;

const EditUserInput = (props) => {
  const networkUser = props.networkUser

  const [input, setInput] = useState(networkUser.getName());

  const handleInputChange = (e) => setInput(e.target.value);

  

  const [isLoading, setIsLoading] = useState(false)
  const isError = input === "";

  async function onSaveUserNanme() {
    if (!input) return;

    setIsLoading(true)
    await networkUser.updateName(input)
    setIsLoading(false)
    props.setNetworkUser(networkUser);
    props.setIsEditUsername(false);
  };

  return (
    <FormControl isInvalid={isError}>
      <Flex>
        <Input id="userName" placeholder="Edit User Name" size="md" value={input} onChange={handleInputChange} />
        <ButtonGroup ml={2} alignItems="center" justifyContent="center" size="md">
          <IconButton onClick={onSaveUserNanme} isLoading={isLoading} variant="saveUserName" icon={<CheckIcon />} />
          <IconButton
            icon={<CloseIcon />}
            onClick={() => {
              props.setIsEditUsername(false);
            }}
          />
        </ButtonGroup>
      </Flex>
    </FormControl>
  );
};
