import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Form, FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';

import { getQueryParameterByName }  from "../utils";
import AccountInfo from "./AccountInfo";
import TransactionData from "./TransactionData";
import { API } from "../etherscan";
import { getAddressFromPrivateKey } from "../txbuilder";


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
      nonce: "",
    });
  }

  componentDidMount() {

    const updateAddressData = this.updateAddressData.bind(this);

    async function init() {
      await updateAddressData();
    }

    init();
  }

  sendTransaction() {
    state.rawTx = buildTx(state.contractAddress, state.privateKey, state.functionSignature, state.functionParameters);
  }

  @action
  setAddressData(address, balance, nonce) {
    this.state.address = address;
    this.state.balance = balance;
    this.state.nonce = nonce;
    console.log(balance, nonce);
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
    const nonce = await api.getTransactionCount(address) || "";
    this.setAddressData(address, balance, nonce);
  }

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

        <h1>Transaction parameters</h1>

        <p>Ethereum Ropsten testnet only</p>

        <FormGroup controlId="apiKey">

          <Col componentClass={ControlLabel} sm={2}>
            Etherscan.io API key
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.apiKey} onChange={onChange} />
          </Col>

        </FormGroup>

        <FormGroup controlId="contractAddress">

          <Col componentClass={ControlLabel} sm={2}>
            Contract address
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.contractAddress} onChange={onChange} />
          </Col>

        </FormGroup>

        <FormGroup controlId="privateKey">

          <Col componentClass={ControlLabel} sm={2}>
            Private key
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.privateKey} onChange={onPrivateKeyChange} />
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
