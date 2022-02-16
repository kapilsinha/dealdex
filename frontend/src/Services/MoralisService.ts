import Moralis from "moralis/node";
import moralisConfig from '../moralisConfig.json'

Moralis.start({ serverUrl: moralisConfig.SERVER_URL, appId: moralisConfig.APP_ID });
export default Moralis;