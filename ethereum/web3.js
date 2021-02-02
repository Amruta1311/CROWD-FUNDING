import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && window.web3 !== 'undefined') {        //handles the case in which our code is being executed inside the browser and metamask is available i.e we check to see if metamsk has already injected web3
    // We are in the browser & metamask is running

    web3 = new Web3(window.web3.currentProvider);

} else {
    // We are on the server *OR* the user is not running metamask
    //We setup our own provider that connects to our rinkeby test network through infura

    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/5bd4bf99b31d4564ad2e0c357c6933b6' // Solely used as portal to access the ethereum network  
    );

    web3 = new Web3(provider);
}

export default web3;