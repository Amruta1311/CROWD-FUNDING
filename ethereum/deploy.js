//Before we were using the Ganache provider which was a very easy time setting up the provider.
// It instantly allowed us to connect to this local test network ans also unlocked a couple of accounts for us.

// This time we set the provider manually. This provider allows us to not only connect to some outside API
// or some outside node, but it also allows us to simultaneously unlock an account. Here we specify
// on what network we need to connect to (Rinkeby in our case). Along with it we also need to use it to 
// somehow unlock an account that will be used for all the different deployment requests that we make.

const HDWalletProvider = require('truffle-hdwallet-provider');  // npm install --save truffle-hdwallet-provider@0.0.3
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(

    'broccoli eager crucial fiction camera chunk obey off claw turn wrap surge',
    'https://rinkeby.infura.io/v3/5bd4bf99b31d4564ad2e0c357c6933b6'

);

const web3 = new Web3(provider);

const deploy = async () => {

    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from accounts', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy( { data: compiledFactory.bytecode } ) //lottery contract does not have any initial arguement to pass to the constructor lottery function
    .send( { gas: '1000000', from: accounts[0] } );

    console.log('Contract deployed to: ', result.options.address);


};

deploy();
