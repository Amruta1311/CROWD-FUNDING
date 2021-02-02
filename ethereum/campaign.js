import web3 from './web3';
import Campaign from './build/Campaign.json';

// We dynamically specify the address. So we use a function to recieve the address and use this address to create a new campaign 

export default(address) => {
    return new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        address
    );
};