
import {useEffect, useState, useContext} from 'react';

import { Button, Box, FormHelperText, Tabs, TabList, TabPanels, Tab, TabPanel, Center } from "@chakra-ui/react";
import DealDexNumberForm from "../../../ReusableComponents/DealDexNumberForm"
import MyInvestment from "./my-investment"
import Invest from "./Invest"



export default function InvestCard(props) {
    const [investAmt, setInvestAmt] = useState("")


    return(
        <Box layerStyle="detailSummaryWrap" w="40%" h="340px" px="20px">
            <Tabs mt={2} >
                 <TabList>
                 <Tab>Invest</Tab>
                 <Tab ml={50}>My Investment</Tab>
              </TabList>
                <TabPanels>
                    <TabPanel>
                        <Invest />
                    </TabPanel>
                    <TabPanel>
                        <MyInvestment />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>

    )
}