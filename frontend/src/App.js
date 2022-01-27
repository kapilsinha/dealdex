import './App.css'
import { Switch, Route, withRouter} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/provider'
import { MoralisProvider } from "react-moralis";
import theme from './Utils/DealDexTheme.js'


import DealDetailsViewSyndicate from './Components/DealDetailsView/Syndicate'
import HomeView from "./Components/HomeView"
import AccountView from './Components/AccountView'
import MakeDealForm from './Components/MakeDealForm'
import Navigation from './Components/Navigation'
import moralisConfig from './moralisConfig.json'
import {NetworkProvider} from './Contexts/NetworkContext'
import {MakeDealFormProvider} from './Contexts/MakeDealFormContext'
import {DealDetailsProvider} from './Contexts/DealDetailsContext'
 
export const APP_ID = moralisConfig.APP_ID;
export const SERVER_URL = moralisConfig.SERVER_URL;


function App() {
  return (
      <div className="App">
        <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
          <ChakraProvider theme={theme} options={{useSystemColorMode: true}}>
            <NetworkProvider>
              <Navigation />
              <Switch>
                <Route path="/" exact>
                  <HomeView />
                </Route>

                <Route path="/createDeal" >
                  <MakeDealFormProvider>
                    <MakeDealForm />
                  </MakeDealFormProvider>
                </Route>

                <Route path="/account" >
                    <AccountView  />
                </Route>
                <Route path="/dealDetails"> 
                  <DealDetailsProvider> 
                    <DealDetailsViewSyndicate />
                  </DealDetailsProvider>
                </Route>
              </Switch>
            </NetworkProvider>       
          </ChakraProvider>
        </MoralisProvider>
      </div>
  );
}

export default withRouter(App);
