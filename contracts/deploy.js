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
