const events = require('events').EventEmitter.defaultMaxListeners = 0;
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

//We require the two compiled versions of our contract

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;

let factory;  // this is going to be reference to the deployed instance of factory that we will make

let campaignAddress;    

let campaign;

beforeEach(async() => {

    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))     // This creates the idea of the contract inside of web3
    .deploy({ data: compiledFactory.bytecode })    //This recieves the actual bytecode that we are trying to deploy to the network
    .send({ from: accounts[0], gas: '1000000'});

    // we use factory to create an instance of the campaign and assign it to the campaign variable so that they are available for the test within the 'it'
    
    await factory.methods.createCampaign('100').send({
        from: accounts[0],  //manager of the campaign
        gas: '1000000'
    })

    //  [campaignAddress] = await factory.methods.getDeployedCampaign().call();     // Destructuring of array but taking the first element of the array that is returned on the RHS and that element is assigned to campaignAddress.

    const addresses = await factory.methods.getDeployedCampaign().call();

    campaignAddress = addresses[0];

    // We do a javascript representation of the contract and that representation needs to be operating against or try to access the contract that exists at this address

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress // we pass in the address as to where this campaign exists
    );      //This is the format of contract call when the contract is already deployed (here in factory part) and we are trying to access the deployed contract in the blockchain or inform web3 of the existence of the contract on the blockchain network

});

describe('Campaigns', () => {

    it('deploys a factory and a campaign', () =>{

        assert.ok(factory.options.address);

        assert.ok(campaign.options.address);

        // Here we make sure that entire testing setup works before we run our tests

    });

    // The person who is calling create campaign should be marked as the manager of the campaign created

    it('marks caller as the campaign manager', async() => {

        const manager = await campaign.methods.manager().call();

        assert.equal(accounts[0], manager);
    });

    //People are able donate money to the campaign

    it('allows people to contribute money and marks themselves as approvers', async() =>{

        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]   // account[0] is the manager, accounts[1]/accounts[2]/etc are all contributors to the campaign
        });

        // We need to make sure that the contract considers us as contributors

        const isContributor = await campaign.methods.approvers(accounts[1]).call();

        assert(isContributor);

    });

    it('requires a minimum contribution', async() => {

        try {

            // we make sure that the test fails inside of try and then it skips to the catch block

            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            }); // this will result in an error and get thrown over to the catch block

            assert(false); 
            
        } catch (err) {

            assert(err);
            
        }

    });

    it('allows a manager to make a payment request', async () => {

        await campaign.methods.createRequest('Buy Batteries', '150', accounts[1]).send({

                from: accounts[0],  //manager is allowed to make payment requests
                gas: '1000000'

            });

        const request1 = await campaign.methods.requests(0).call();  // returns the request

        assert.equal('Buy Batteries', request1.description);
    });

    it('processed requests', async () => {

        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1]).send({

            from: accounts[0],
            gas: '1000000'

        });

        await campaign.methods.approveRequest(0).send({

            from: accounts[0],
            gas: '1000000'

        });

        await campaign.methods.finalizeRequest(0).send({

            from: accounts[0],
            gas: '1000000'

        });

        let balance = await web3.eth.getBalance(accounts[1]);

        balance = web3.utils.fromWei(balance, 'ether'); // balance is going to be string

        balance = parseFloat(balance);  // Takes the string and turns it into a decimal number

        console.log(balance);
        
        assert(balance > 104);      // Initial balance of accounts[1] will be 99.99 something ethers becuase of the transaction done to create a request

    });

});