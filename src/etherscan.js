// Polyfills
require("babel-core/register"); // http://stackoverflow.com/a/33527883/315168
require("babel-polyfill"); // http://stackoverflow.com/a/33527883/315168
require('es6-promise').polyfill(); // https://github.com/matthew-andrews/isomorphic-fetch

import fetch from 'isomorphic-fetch';

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

    console.log("API result", data);

    if(data.status == "1") {
      return data.result;
    } else {
      return null;
    }
  }

  async getBalance(address) {
    // https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=YourApiKeyToken
    let params = {
      apikey: this.apiKey,
      module: "account",
      action: "balance",
      address: address,
      tag: "latest",
    };
    return this.makeRequest(params);
  }
};
