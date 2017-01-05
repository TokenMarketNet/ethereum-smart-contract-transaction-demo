# Ethereum smart contract call and transaction signing demo
 
## Introduction 
 
This a tutorial blog post and demo app showing how to deploy an Ethereum smart contract and transacting with this contract from a web user interface. For the deployment of the contract Go Ethereum is used. For the API calls Etherscan.IO API service is used.

There is a demo app written using React and Bootstrap. The application is coded in ECMAScript 2016 and wrapped together using Webpack.

All private keys are held 100% on the client side and transaction is constructed in JavaScript, making the example optimal to follow if you are working with non-custodian wallets or Dapps. 

We use both command line Node.js tools and browser based JavaScript in this demo.

## View demo

If you do not wish to run the React app locally you have one free-to-use app available here:

[ethereum-transaction-toy.tokenmarket.net](https://ethereum-transaction-toy.tokenmarket.net/)

## Prerequisites

You need to be comfortable in advanced JavaScript programming. You need to have geth (Go-Ethereum) node or any Ethereum node software running in a Ethereum Ropsten testnet. See below how to install and connect to one safely.

## Features 

* Interact with Ethereum blockchain over both Go-Ethereum JSON-RPC connection and EtherScan.io API

* Interact with smart contracts from web browser JavaScript

* Deploy a smart contract from a command line

* Generate private and public key pair offline

* Push transactions through etherscan.io API or optional sign tranactions offline

* Sample Solidity contract source code

## Getting started 

Clone the [Github repository](https://github.com/TokenMarketNet/ethereum-smart-contract-transaction-demo).

Install Node version 7.2.1 or later. Use [nvm](https://github.com/creationix/nvm) script to make this easy for you.

Install all dependencies:

    nvm use 7.2.1
    npm install 

## Running Ethereum node (Go-Ethereum) in a testnet
 
This demostration is built Ethereum Ropsten testnet in mind. The public testnet is ideal for cases where you don't want to spend any money to test your contracts, but you still want to share them publicly and use public blockchain explorers to debug your contracts. Ropsten testnet mining difficulty is very low and anyone can mine some testnet ETH there using the CPU. 

Note that running a private testnet usin geth is still much faster alternative, transaction delay wise, compared to the public testnet. 

You can run geth on a server (2GB VPS) and then connect it to using SSH tunneling to avoid the CPU burden and sync delays on your local development laptop. 

[See here how to deploy geth securely on a server and then build a SSH tunnel from your local development computer to server running geth](https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4)

[See another blog post how to set up geth with password protected JSON RPC ](https://tokenmarket.net/blog/protecting-ethereum-json-rpc-api-with-password/)

## Creating a private key

The demo app has a text input that directly takes your Ethereum account private key.

A private key is just a 256 bit number. You can generate one easily from a passphrase using sha3 hash in node console.

First launch node.js:
    
    node
    
Then generate a private key from a passphrase in Nod console:
    
    Web3 = require("Web3");
    web3 = new Web3();
    
    privateKeyRaw = web3.sha3("Toholampi is the best town on the world");
    '0x4fe8deb1d5e5908bd05bf8b8aad6f3a5fbce70a95e3f65fe85cbe6d3f4e44f77'
    
To get a matching Ethereum address for your private key:

    Wallet = require("ethers-wallet");
    wallet = new Wallet(privateKeyRaw);
    wallet.address
    '0x062Abe5fbaEf147d765C40F73aB31a6B05aEb8Ca'
     
## Transferring ETH on your private key address
    
Make sure JSON-RPC is available on `http://localhost:8545`.
    
Connect to your geth and send some balance from geth coinbase address to this address:
    
    geth attach http://localhost:8545

Check your coinbase address has some balance:

    web3.eth.getBalance(web3.eth.coinbase)
    181147570016639999999
    
Unlock your coinbase account so that you can do withdraws from it:
    
    web3.personal.unlockAccount(web3.eth.coinbase);

Transfer 0.1 ETH to your private key address as generated above:
 
    web3.eth.sendTransaction({from: web3.eth.coinbase, to: '0x062Abe5fbaEf147d765C40F73aB31a6B05aEb8Ca', value: web3.toWei("0.1", "ether")});
    "0x41f6c6fbdfd4184172d61b390922270db087519137c43d3052fbad33876964f7"

[See my demo transaction in Etherscan Ropsten explorer](https://testnet.etherscan.io/tx/0x41f6c6fbdfd4184172d61b390922270db087519137c43d3052fbad33876964f7).

## Creating a smart contract

We use the following sample smart contract for the demo:

```
pragma solidity ^0.4.4;

contract SampleContract {

    // This value is visible in etherscan.io explorer
    uint public value;

    // Anyone can call this contract and override the value of the previous caller
    function setValue(uint value_) public {
        value = value_;
    }

}
```

## Deploying a contract

**Note**: You can skip this step if you want as there is already a deployed test contract [here](https://testnet.etherscan.io/address/0xe0b79b3d705cd09435475904bf54520929eae4e8).

You need to have

* Geth JSON-RPC API running at `http://localhost:8545` connected to Ropsten testnet (see below for geth info)

* You need to have balance on your Geth coinbase account (run --mine to generate some)

First compile the contract to create `contracts.json` ABI definitions:

```console
cd contracts
solc SampleContract.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
```

Then you can deploy the contract using the attached `deploy.js` script.

```console
node --harmony-async-await  deploy.js
```

The sample deployment script is a JavaScript script that reads contract ABI definitions and communicates with geth over JSON-RPC using web3 wrapper:

```javascript
// Copyright 2017 https://tokenmarket.net - MIT licensed
//
// Run with Node 7.x as:
//
// node --harmony-async-await  deploy.js
//

let fs = require("fs");
let Web3 = require('web3'); // https://www.npmjs.com/package/web3

// Create a web3 connection to a running geth node over JSON-RPC running at
// http://localhost:8545
// For geth VPS server + SSH tunneling see
// https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// Read the compiled contract code
// Compile with
// solc SampleContract.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
let source = fs.readFileSync("contracts.json");
let contracts = JSON.parse(source)["contracts"];

// ABI description as JSON structure
let abi = JSON.parse(contracts.SampleContract.abi);

// Smart contract EVM bytecode as hex
let code = contracts.SampleContract.bin;

// Create Contract proxy class
let SampleContract = web3.eth.contract(abi);

// Unlock the coinbase account to make transactions out of it
console.log("Unlocking coinbase account");
var password = "";
try {
  web3.personal.unlockAccount(web3.eth.coinbase, password);
} catch(e) {
  console.log(e);
  return;
}

console.log("Deploying the contract");
let contract = SampleContract.new({from: web3.eth.coinbase, gas: 1000000, data: code});

// Transaction has entered to geth memory pool
console.log("Your contract is being deployed in transaction at http://testnet.etherscan.io/tx/" + contract.transactionHash);

// http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
async function waitBlock() {
  while (true) {
    let receipt = web3.eth.getTransactionReceipt(contract.transactionHash);
    if (receipt && receipt.contractAddress) {
      console.log("Your contract has been deployed at http://testnet.etherscan.io/address/" + receipt.contractAddress);
      console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io");
      break;
    }
    console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
    await sleep(4000);
  }
}

waitBlock();
```

[See a sample deployed contract](https://testnet.etherscan.io/address/0xe0b79b3d705cd09435475904bf54520929eae4e8#code)

## Create Etherscan.io API key

[Sign up to Etherscan.io and create API key there](https://etherscan.io/)

## Building a contract call

Now when your contract is deployed, you have a private key to your account, you have your Etherscan.io API key, you can make some calls to the contract.

Either run the app locally (below) or [directly use the hosted version](https://ethereum-transaction-toy.tokenmarket.net/). 

## Developing app locally

If you wish to edit this application and use it as a starting point for your own product you can run WebPack automatically reloading development server locally:

    npm start

## Bonus: Calling contract using geth

You can also call the contract using a command line script.
 
Here is an example:

```javascript
    /* Call the contract using web3-
    *
    * To run:
    *
    *        nvm use 7.2.1
    *       ./node_modules/babel-cli/bin/babel-node.js --presets es2015 ./tests/callcontract.js
    *
    */
    
    import fs from "fs";
    import Web3  from 'web3';
    
    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    
    // Fetch ABI
    let source = fs.readFileSync("contracts/contracts.json");
    let contracts = JSON.parse(source)["contracts"];
    let abi = JSON.parse(contracts.SampleContract.abi);
    
    // Get a proxy on our Ropsten contract
    let SampleContract = web3.eth.contract(abi);
    let contract = SampleContract.at('0xe0b79b3d705cd09435475904bf54520929eae4e8');
    
    // Perform a transaction using ETH from the geth coinbase account
    web3.personal.unlockAccount(web3.eth.coinbase, "");
    
    // Set the account from where we perform out contract transactions
    web3.eth.defaultAccount = web3.eth.coinbase;
    
    let tx = contract.setValue(3000, {gas: 200000});
    console.log("Our tx is https://testnet.etherscan.io/tx/" + tx);

```

## Used components

* [Mobx React scaffold](https://github.com/cafreeman/generator-mobx-react)
 
* [web3.js](https://github.com/ethereum/web3.js/)

* [react-bootstrap](https://react-bootstrap.github.io/)

* [ethereumjs-tx](https://github.com/ethereumjs/ethereumjs-tx)

* [ethers-wallet](https://www.npmjs.com/package/ethers-wallet)