# Ethereum smart contract call and transaction signing demo
 
## Introduction 
 
This demo app demostrates how to deploy an Ethereum smart contract and then call this contract functions from a web user interface. There is a demo app written using React and Bootstrap that can call an arbitrary Ethereum contract using Etherscan.io API service. The application is coded in ECMAScript 2016 and put together using Webpack.

All keys are held 100% client side and transaction is constructed in JavaScript, making the example optimal for non-custodian wallets and Dapps. 

We use both command line Node.js tools and browser based JavaScript in this demo.

## Prerequisites

You need to be comfortable in advanced JavaScript programming. You need to have geth (Go-Ethereum) node or any Ethereum node software running in a Ethereum Ropsten testnet. See below how to install and connect to one safely.

## Features 

* Deploy a smart contract from command line

* Create private and public key pair offline

* Push transaction through etherscan.io API or optional work offline

* Sample Solidity contract source code

* Fill in the smart contract call parameters from URL or window.localStorage

## Getting started 

Clone the Github repository.

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
node deploy.js
```

The sample deployment script is a JavaScript script that reads contract ABI definitions and communicates with geth over JSON-RPC using web3 wrapper:

```javascript
let fs = require("fs");
let Web3 = require('web3');

// https://www.npmjs.com/package/web3
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

let source = fs.readFileSync("contracts.json");
let contracts = JSON.parse(source)["contracts"];

let SampleContract = web3.eth.contract(contracts.SampleContract.abi);

// https://github.com/ethereum/wiki/wiki/JavaScript-API
console.log("Deploying the contract");
let contractInstance = SampleContract.new({from: web3.eth.coinbase, gas: 1000000});
```

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
     
## Transferring some ETH on your private key address
    
Connect to your geth and send some balance from geth coinbase address to this address:
    
    

## Building a contract call

Now when your contract is deployed 


## Used components

* [Mobx React scaffold](https://github.com/cafreeman/generator-mobx-react)
 
* [web3.js](https://github.com/ethereum/web3.js/)

* [react-bootstrap](https://react-bootstrap.github.io/)

* [ethereumjs-tx](https://github.com/ethereumjs/ethereumjs-tx)

* [ethers-wallet](https://www.npmjs.com/package/ethers-wallet)