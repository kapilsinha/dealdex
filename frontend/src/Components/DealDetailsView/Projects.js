import React, { useState } from "react";
import { Button, Container, Flex, FormControl, FormLabel, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, HStack, Badge, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react";
import StepPercent from "./Components/step-percent";
import ProgressPercent from "./Components/progress-percent";

import { ReactComponent as IconArrowRightUpLine } from "../../assets/icon/ArrowRightUpLine.svg";
import { RoundNumbers } from "../../Utils/ComponentUtils";

const DummyData = {
  ethPerToken: "Postered Coin (PSTRD)",
  tokenPrice: "5200.50",
  vestPercent: 0,
  nftunit: "USDC",
  unit: "USDC",
  deadline: "Dec 26, 2021 07:14:31",
  deadlineOver: false,
  minInvest: "100",
  maxInvest: "850.50",
  minRound: "1500",
  maxRound: "12000",
  amtRasied: "10000",
  totalRasied: "11,000",
  nftName: "BAYC",
  verified: true,
  nftTokenArray: ["0xdf7952b35f24acf7fc0487d01c8d5690a60dba07", "0xdf7952b35f24acf7fc0487d01c8d5690a60dba07", "0xdf7952b35f24acf7fc0487d01c8d5690a60dba07", "0xdf7952b35f24acf7fc0487d01c8d5690a60dba07"],
  nextInvesting: "May 3, 2022 07:14:31",
};

function DealDetailsViewProject(props) {
  const [dealData, setDealData] = useState(DummyData);

  return (
    <Container maxW="container.xl" p={0}>
      <Flex h={{ base: "auto", md: "100vh" }} py={[0, 10, 20]} direction={{ base: "column-reverse", md: "row" }}>
        <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
          <VStack w="full" spacing={3} alignItems="center">
            <Heading size="2xl">Postered Series A</Heading>
            <HStack>
              <Text fontSize="2xl" color="gray.500">
                MoonBoots Capital
              </Text>
              {dealData && dealData.verified && (
                <Box ml={2}>
                  <Badge variant="verified2">VERIFIED</Badge>
                </Box>
              )}
            </HStack>
          </VStack>
          <VStack w="full" spacing={3} alignItems="flex-start">
            <Heading size="xl">Summary</Heading>
            <HStack w="full" py="20px" spacing={5}>
              <Box layerStyle="detailSummaryWrap" w="15%">
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  Status
                </Text>
                <Heading size="md" py="3px" color="blue.300">
                  Completed
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Deal is closed
                </Text>
              </Box>
              <Box layerStyle="detailSummaryWrap" w="26%">
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  NEXT VESTING
                </Text>
                <Heading size="md" py="3px">
                  {dealData.nextInvesting}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  UTC time
                </Text>
              </Box>
              <Box layerStyle="detailSummaryWrap" w="20%">
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  TOTAL RAISED
                </Text>
                <Heading size="md" py="3px">
                  {dealData.totalRasied}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {dealData.nftunit}
                </Text>
              </Box>
              <Box layerStyle="detailSummaryWrap" w="20%">
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  NFT
                </Text>
                <HStack justify="space-between">
                  <Heading size="md" py="3px">
                    {dealData.nftName}
                  </Heading>
                  <Button variant='ghost' size="xs"><IconArrowRightUpLine /></Button>
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  Bored Ape Yacht Club
                </Text>
              </Box>
              <Box layerStyle="detailSummaryWrap" w="14%">
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  TOKEN PRICE
                </Text>
                <Heading size="md" py="3px">
                  {dealData.tokenPrice}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {dealData.unit}
                </Text>
              </Box>
            </HStack>
          </VStack>
          <VStack w="full" spacing={3} alignItems="flex-start">
            <HStack w="full" py="10px" spacing={5}>
              <Box layerStyle="detailSummaryWrap" w="60%" h="340px" px="40px">
                <Heading size="md" py="3px">
                  The Project
                </Heading>
                <Box layerStyle="detailSummaryWrap" w="100%" my="20px">
                  <Table variant="dealDetailProjectTable" size="md">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th></Th>
                        <Th textAlign={"right"}>Postered Eyewear</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Token</Td>
                        <Td textAlign={"right"}>
                          <Button variant="dealDetailTable" size="sm">
                            Update
                          </Button>
                        </Td>
                        <Td textAlign={"right"}>{dealData.ethPerToken}</Td>
                      </Tr>
                      <Tr>
                        <Td>Token Price</Td>
                        <Td textAlign={"right"}>
                          <Button variant="dealDetailTable" size="sm">
                            Update
                          </Button>
                        </Td>
                        <Td textAlign={"right"}>
                          {dealData.tokenPrice} {dealData.unit}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Total Raised</Td>
                        <Td></Td>
                        <Td textAlign={"right"}>
                          {dealData.totalRasied} {dealData.unit}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </Box>
              <Box layerStyle="detailSummaryWrap" w="40%" h="340px" px="20px">
                <Tabs mt={4} variant="dealDetailProjectTab">
                  <TabList>
                    <Tab>Claim Funds</Tab>
                    <Tab ml={50}>Deposit Tokens</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <VStack>
                        <VStack spacing={1} w="full" alignItems="flex-start">
                          <Heading size="sm" py="3px" w="full" textAlign="left">
                            Amount
                          </Heading>
                        </VStack>
                        <MakeDealFormNumberItem colSpan={2} onChange={(value) => setDealData({ ...dealData, amount: value })} placeholder="0.0" value={dealData.amount ? dealData.amount : "0.0"} maxvalue={100} parsing={true} appendChar={dealData.nftunit} />
                      </VStack>
                      <HStack pb={3}>
                        <Heading size="sm" py="3px" w="full" textAlign="left">
                          Avaialble funds:
                        </Heading>
                        <Heading size="sm" py="3px" w="full" textAlign="right">
                          {dealData.totalRasied} {dealData.unit}
                        </Heading>
                      </HStack>
                      <HStack mt={50} w="full" justify="center">
                        <Button variant="dealDetailTable" size="lg">
                          Claim Funds
                        </Button>
                      </HStack>
                    </TabPanel>
                    <TabPanel>
                      <VStack mb={5}>
                        <Select placeholder="Select the token">
                          <option value="option1">Option 1</option>
                        </Select>
                      </VStack>
                      <VStack>
                        <VStack spacing={1} w="full" alignItems="flex-start">
                          <Heading size="sm" py="3px" w="full" textAlign="left">
                            Amount
                          </Heading>
                        </VStack>
                        <MakeDealFormNumberItem colSpan={2} onChange={(value) => setDealData({ ...dealData, amount: value })} placeholder="0.0" value={dealData.amount ? dealData.amount : "0.0"} maxvalue={100} parsing={true} appendChar={dealData.nftunit} />
                      </VStack>
                      <HStack mt={30} w="full" justify="center">
                        <Button variant="dealDetailTable" size="lg">
                          Deposit Tokens
                        </Button>
                      </HStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </HStack>
          </VStack>
          <VStack w="full" spacing={3} alignItems="flex-start" pb="100px">
            <Heading size="xl">Other information</Heading>
            <HStack w="full" py="10px" spacing={5}>
              <Box layerStyle="detailSummaryWrap" w="54%" h="250px" px="40px">
                <Heading size="md" py="3px">
                  Vesting
                </Heading>
                <StepPercent percent={30} />
                <HStack mt={50} w="full" justify="center">
                  <Button variant="dealDetailTable" size="lg">
                    Edit Vesting
                  </Button>
                </HStack>
              </Box>
              <Box layerStyle="detailSummaryWrap" w="46%" h="250px" px="40px">
                <Heading size="md" py="3px">
                  Funding Amount
                </Heading>
                <HStack w="full" py="20px" spacing={5}>
                  <Box layerStyle="detailSummaryWrap" w="50%">
                    <Text fontSize="sm" color="gray.500" fontWeight="500">
                      ROUND SIZE
                    </Text>
                    <Heading size="md" py="3px">
                      <RoundNumbers num={dealData.minRound} /> - <RoundNumbers num={dealData.maxRound} />
                    </Heading>
                    <Text fontSize="sm" color="gray.500">
                      {dealData.nftunit}
                    </Text>
                  </Box>
                  <Box layerStyle="detailSummaryWrap" w="50%">
                    <Text fontSize="sm" color="gray.500" fontWeight="500">
                      AMT RAISED
                    </Text>
                    <Heading size="md" py="3px">
                      <RoundNumbers num={dealData.amtRasied} />
                    </Heading>
                    <Text fontSize="sm" color="gray.500">
                      {dealData.unit}
                    </Text>
                  </Box>
                </HStack>
                <ProgressPercent percent={100} />
              </Box>
            </HStack>
          </VStack>
        </VStack>
      </Flex>
    </Container>
  );
}

export function MakeDealFormNumberItem(props) {
  let title = props.title;
  let colSpan = props.colSpan;
  let onChange = props.onChange;
  let placeholder = props.placeholder;
  let helperText = props.helperText;
  let value = props.value;
  var isRequired;
  if (props.isRequired) {
    isRequired = props.isRequired;
  } else {
    isRequired = false;
  }

  return (
    <>
      <FormControl isRequired={isRequired} pb={1} mt="0px" width={props.width}>
        <FormLabel>{title}</FormLabel>
        <NumberInput value={value} precision={1} step={0.1} min={0} max={props.maxvalue} onChange={onChange} placeholder={placeholder}>
          <NumberInputField />
          {!(props.appendChar !== "%" && (value === "0.0" || value === ".0" || value === "0" || value === "0.")) && <InputLeftElement ml={(value.length - 1) * 8.6 + 25 + "px"} width="fit-content" children={<Text variant="dealInputAppendix">{props.appendChar}</Text>} />}
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {helperText && (
          <FormHelperText textAlign="left" fontSize="16px">
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    </>
  );
}

export default DealDetailsViewProject;
