import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Form, FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';

import { getQueryParameterByName }  from "../utils";
import AccountInfo from "./AccountInfo";
import TransactionData from "./TransactionData";
import { API } from "../etherscan";
import { getAddressFromPrivateKey, buildTx, calculateNonce } from "../txbuilder";


/**
 * Transaction builder user interface.
 */
@observer
class Signer extends React.Component {

  constructor(props) {

    super(props);

    // Fetch signer state from URL/localStorage on app init
    const url = window.location.href;
    const privateKey = getQueryParameterByName("privateKey", url) || window.localStorage.getItem("privateKey") || "";

    // Define the state of the signing demo componen
    this.state = observable({
      apiURL: "https://testnet.etherscan.io/api",
      privateKey: privateKey,
      contractAddress: getQueryParameterByName("privateKey", url) || window.localStorage.getItem("contractAddress") || "0xe0b79b3d705cd09435475904bf54520929eae4e8",
      apiKey: getQueryParameterByName("apiKey", url) || window.localStorage.getItem("apiKey") || "",
      functionSignature: window.localStorage.getItem("functionSignature") || "setAmount(uint)",
      functionParameters: window.localStorage.getItem("functionParameters") || "2000",
      address: getAddressFromPrivateKey(privateKey) || "",
      balance: "",
      rawTx: "",
      nonce: "", // Calculated nonce as int
      sendStatus: false, // True when send in progress
      sendError: null, //
      sentTxHash: null, // Point to etherscan.io tx
      baseNonce: 0, // How many txs has gone out from the address
      nonceOffset: 1, // Maintain internal state of added nonces, because Etherscan getTransactionCount() cannot seem to be able to deal very well with uncorfirmed txs
    });
  }

  // Refresh address data when the app is loaded
  componentDidMount() {
    const updateAddressData = this.updateAddressData.bind(this);
    async function init() {
      await updateAddressData();
    }
    init();
  }

  // Handle Send transaction button
  @action
  sendTransaction() {
    const updateAddressData = this.updateAddressData.bind(this);
    let state = this.state;
    state.rawTx = buildTx(state);

    async function _send() {

      if(state.apiKey) {
        state.sendStatus = true;
        const api = new API(state.apiURL, state.apiKey);


        try {
          state.sentTxHash = await api.sendRaw(state.rawTx);
          state.sendError = null;
          console.log("Transaction sent, hash", state.sentTxHash);
        } catch(e) {
          state.sendError = "" + e;
          console.log(e);
        }

        await updateAddressData();
        state.sendStatus = false;
      }
    }

    _send();
  }

  // Update data about the address after fetched over API
  @action
  setAddressData(address, balance, nonce) {
    this.state.address = address;
    this.state.balance = balance;
    this.state.nonce = nonce;
  }

  // Update the Ethereum address balanc from etherscan.io API
  async updateAddressData() {

    let state = this.state;
    let address = getAddressFromPrivateKey(state.privateKey);

    console.log("Address for private key", state.privateKey, "is", state.address);

    if(!address) {
      this.setAddressData("Could not resolve address", "", "");
      return;
    } else {
      state.address = address;
    }

    console.log("Updating address information for", address, state);

    if(!address || !state.apiKey) {
      // No address available
      return;
    }
    const api = new API(state.apiURL, state.apiKey);
    const balance = await api.getBalance(address) || "";

    state.baseNonce = await api.getTransactionCount(address) || "";
    if(state.baseNonce) {
      state.baseNonce = parseInt(state.baseNonce, 16);
    }

    state.nonceOffset += 1;
    const nonce = calculateNonce(state.baseNonce, 0x100000, state.nonceOffset);

    this.setAddressData(address, balance, nonce);
  }

  // Handle text changes in input fields
  onChange(event) {

    let state = this.state;
    let name = event.target.id;
    let value = event.target.value;

    // Update state
    state[name] = value;
    console.log("Updated", name, value);

    // Store to survive refresh
    window.localStorage.setItem(name, value);
  }

  // Handle private kery edit
  onPrivateKeyChange(event) {
    let state = this.state;
    this.onChange(event);
    this.updateAddressData();
  }

  render() {

    const state = this.state;
    const onPrivateKeyChange = this.onPrivateKeyChange.bind(this);
    const onChange = this.onChange.bind(this);
    const sendTransaction = this.sendTransaction.bind(this);

    return (
      <Form horizontal>

        <h1>Build a smart contract transaction</h1>

        <p>Ethereum Ropsten testnet only</p>

        <FormGroup controlId="apiKey">

          <Col componentClass={ControlLabel} sm={2}>
            Etherscan.io API key
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.apiKey} onChange={onChange} />
            <p className="text-muted">
              Sign up on <a target="_blank" href="https://etherscan.io">EtherScan.io</a>.
            </p>

          </Col>

        </FormGroup>

        <FormGroup controlId="contractAddress">

          <Col componentClass={ControlLabel} sm={2}>
            Contract address
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.contractAddress} onChange={onChange} />

            <p className="text-muted">
              <a target="_blank" href={"https://testnet.etherscan.io/address/" + state.contractAddress}>View on EtherScan.io</a>.
            </p>

          </Col>

        </FormGroup>

        <FormGroup controlId="privateKey">

          <Col componentClass={ControlLabel} sm={2}>
            Private key
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.privateKey} onChange={onPrivateKeyChange} />

            <p className="text-muted">
              Derived from a passphrase using sha3() function.
            </p>
          </Col>

        </FormGroup>

        <FormGroup controlId="functionSignature">

          <Col componentClass={ControlLabel} sm={2}>
            Function signature
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.functionSignature} onChange={onChange} />
          </Col>

        </FormGroup>

        <FormGroup controlId="functionSignature">

          <Col componentClass={ControlLabel} sm={2}>
            Function parameters
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.functionParameters} onChange={onChange} />
            <p className="text-muted">Comma separated list</p>
          </Col>

        </FormGroup>

        <Button bsStyle="primary" onClick={sendTransaction}>Send transaction</Button>

        {state.rawTx && <TransactionData state={state} />}

        <AccountInfo state={state} />

      </Form>
    );
  }
}

Signer.propTypes = {
  store: React.PropTypes.object,
};

export default Signer;
