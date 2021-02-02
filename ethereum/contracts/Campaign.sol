pragma solidity ^0.4.17; //This specifies the version of solidity that our code is written with

contract CampaignFactory {
    
    address[] public deployedCampaigns;         //Addresses of all deployed Campaigns that have been created
    
    function createCampaign(uint minimum) public {          //Deploys a new instance of a Campaign and stores the resulting address
        
        address newCampaign = new Campaign(minimum, msg.sender);  // Creates a new contract that gets deployed to the blockchain // msg.sender is the address of the user who is trying to create the new campaign. If we do not pass it then the default msg.sender with the CampaignFactory's address which should not be the case
        
        deployedCampaigns.push(newCampaign);
        
    }
    
    function getDeployedCampaign() public view returns(address[]) {     //Returns a list of all deployed campaigns
        
        return deployedCampaigns;
        
    }
}

contract Campaign { // defines a new contract that will have some number of methods and variables

    struct Request {
        
        string description;     // Describes why the request is being created
        
        uint value;             // Amount of money that the manager wants to send to the vendor
        
        address recipient;      // Address that the money will be sent to
        
        bool complete;          // True if the request has already been processed (money sent)
        
        uint approvalCount;     // keeps track of the number of yes votes that the request has recieved 
        
        mapping(address => bool) approvals; //Keeps track of whether or not someone has voted on a given request
        
    }


    address public manager;   // Holds the address of the person who is managing the contract
    
    uint public minimumContribution;  // Minimum donation required to be considered a contributor or 'approver'
    
    mapping(address => bool) public approvers;  // List of addresses of every person who has donated the money using mapping
    
    uint public approversCount;  // The approvers variable is a mapping and thus we cannot iterate through it to count the number of approveres. Thus we introduce this variable
    
    Request[] public requests;   // List of requests that the manager has created
    
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    
    function Campaign(uint minimum, address creator) public {
        
        manager = creator; // Gives the address on who is attempting to create the contract
        
        minimumContribution = minimum;
        
    }
    
    
    function contribute() public payable {   // Payable makes the function able to recieve some amount of money
    
        require(msg.value > minimumContribution);  // The below statements will be executed only when the given condition is satisfied
        
        approvers[msg.sender] = true ;  // The address of the person who is sending in the transaction will be added to the list of approvers
        
        // Here the address does not get stored inside the mapping. Only the value true gets stored. Mapping uses a hashing mechanism to access the values to the corresponding keys. This makes searching easier through constant time search rather than linear time search as in the case of arrays that costs us a lot of gas to execute the operation
    
        approversCount++;
    }
    
    
    function createRequest(string description1, uint value1, address recipient1) public restricted {   // Called by the manager to create a new 'spending' request
    
   //     require(approvers[msg.sender]);  // This will look up our approvers mapping and try to access the key of this address inside of it.
    
        Request memory newRequest = Request({  // 'memory' is similar call by value that makes a copy and does not change th values of original data.  'storage' is similar to call by reference and it does not make a copy but rather operates on the actual values
            // If we use 'storage' here, it will cause an error. This is because the below are the memory values and therefore it cannot be turned to storage type values.
            
            description: description1,
            
            value: value1,
            
            recipient: recipient1,
            
            complete: false,
            
            approvalCount: 0      // We do not initialise the reference type like mapping (approvals here). We only initialise the value types as given here.
            
        });
        
        requests.push(newRequest);
        
    }
    
    function approveRequest(uint index) public {
        
        Request storage request = requests[index];
        
        // First we make sure that the person approving the request is a donator
       
        require( approvers[msg.sender] );
        
        // Next we make sure that this donator has not voted on this request before
        
        require( !request.approvals[msg.sender] );  //Check the particular request through index and accesses the approvals property and check to see if the address of the person is already present in the mapping
        
        request.approvals[msg.sender] = true;  // This makes user that the same donator does not vote multiple times on the same request in the future.
        
        request.approvalCount++ ; // Here we increment the number of approvals for the request that we have
        
    }
    
    
    function finalizeRequest(uint index) public restricted {
        
        Request storage request = requests[index];
        
        require( request.approvalCount > (approversCount / 2) ); // The condition to approve the request
        
        require( !request.complete );  // We make sure that people are not able to finalize the same request multiple times
        
        request.recipient.transfer(request.value);   // we send the amount of money to the vender
        
        request.complete = true;
        
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,       // Gives the amount of money the contract has available
            requests.length,    //Number of pending requests
            approversCount,      // Gives the total number of contributors
            manager
        );
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }
    

}