// Polyfills
require("babel-core/register"); // http://stackoverflow.com/a/33527883/315168
require("babel-polyfill"); // http://stackoverflow.com/a/33527883/315168
require('es6-promise').polyfill(); // https://github.com/matthew-andrews/isomorphic-fetch

import fetch from 'isomorphic-fetch';
import Web3 from 'web3';

const web3 = new Web3();

/** Throw when API call failes. */
export class APIError extends Error {
};


export class API {

  constructor(baseURL, apiKey) {
    this.baseURL = baseURL;
    this.apiKey= apiKey;
  }

  /**
   * Perform an async HTTP request to EtherScan API
   * @param params
   * @returns {*}
   */
  async makeRequest(params) {

    // http://stackoverflow.com/a/34209399/315168
    let esc = encodeURIComponent;
    let query = Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');

    let response = await fetch(this.baseURL + "?" + query);
    let data = await response.json();

    if(data.error) {
      // {"jsonrpc":"2.0","error":{"code":-32010,"message":"Insufficient funds. Account you try to send transaction from does not have enough funds. Required 62914560000000000 and got: 37085440000000000.","data":null},"id":1}
      throw new APIError(data.error.message);
    }

    console.log("API result", data);
    return data.result;
  }

  /**
   * Return account balance as as Ether, a BigDecimal string.
   * @param address
   * @returns {*}
   */
  async getBalance(address) {
    // https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=YourApiKeyToken
    let params = {
      apikey: this.apiKey,
      module: "account",
      action: "balance",
      address: address,
      tag: "latest",
    };
    let balance = await this.makeRequest(params);
    if(balance) {
      return web3.fromWei(balance, "ether");
    } else {
      return balance;
    }
  }

  /**
   * Get sent transaction count, including transactions in memory pool.
   *
   * Also can be used as a nonce.
   *
   * @param address
   */
  async getTransactionCount(address) {
    let params = {
      apikey: this.apiKey,
      module: "proxy",
      action: "eth_GetTransactionCount",
      address: address,
      tag: "pending",
    };
    return await this.makeRequest(params);
  }

  /**
   * Push out a raw signed transaction
   *
   * @param data Transaction as hex
   * @return tx hash
   */
  async sendRaw(data) {

    if(!data.startsWith("0x")) {
      throw new Error("Data does not look like 0x hex string:" + data);
    }

    let params = {
      apikey: this.apiKey,
      module: "proxy",
      action: "eth_sendRawTransaction",
      hex: data,
      tag: "latest",
    };
    return await this.makeRequest(params);
  }

  async getGasPrice() {

    let params = {
      apikey: this.apiKey,
      module: "proxy",
      action: "eth_gasPrice",
    };
    return await this.makeRequest(params);
  }
};
