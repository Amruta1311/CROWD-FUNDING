// Instead of each time compiling it before executing, we can compile it for once and 
// then write the output to a new file inside of our projectand then access that 
// particular compiled version for the future.

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');  // gives access to the file system to our computer

const buildPath = path.resolve(__dirname, 'build'); //We take our current working directory and second argument is passed to run the build script

fs.removeSync(buildPath);    //We call this function to remove that entire 'build' directory and everything inside of it.

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

const source = fs.readFileSync(campaignPath, 'utf8');

//After getting the contents of the campaign file, we use the solidity compiler to compile everything

const output = solc.compile(source, 1).contracts; // We only care about the contracts property

fs.ensureDirSync(buildPath); // Before we start writing any output to the build directory, we have to recreate that folder. This command ensures if the directory exists and if it doesn't then we recreate that for it.

//  console.log(output);

for(let contract in output) {   //  the output contains the two contracts that we have made
    fs.outputJSONSync(      //This writes a json file to some specified folder inside of our directory
        path.resolve(buildPath, contract.replace(':', '') + '.json'),    // we pass a path to the buildPath. contract.replace function repalces the colon character with the empty string 
        output[contract]        // This contains the actual contents that we want to write to the above json files 
    );
}

// Anytime we change the contract, we need to rerun the compile compile.js file to make the ammendments in the output

// Otherwise if no changes occur then we can carry on the execution with one time compile based on the output that we have got in the build folder
