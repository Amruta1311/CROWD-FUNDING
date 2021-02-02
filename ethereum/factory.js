import web3 from './web3';  // we are not accessing the contrcutor of web3 but the instance that we created in the web3.js folder

// We import the compiled contract
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x2c13E2e1Eb314957cA772eAACA5c6Af5c216674c'    // Contract deployed to this address
);

export default instance;