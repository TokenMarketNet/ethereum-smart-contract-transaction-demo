import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Form, FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import { getQueryParameterByName, getAddressFromPrivateKey}  from "../utils";
import AccountInfo from "./AccountInfo";


// Fetch signer state from URL/localStorage on app init
const url = window.location.href;


let privateKey = getQueryParameterByName("privateKey", url) || window.localStorage.getItem("privateKey") || "";

// Define the state of the signing demo componen
let state = observable({
  apiURL: "https://testnet.etherscan.io/api",
  privateKey: privateKey,
  contractAddress: getQueryParameterByName("privateKey", url) || window.localStorage.getItem("contractAddress") || "0xe0b79b3d705cd09435475904bf54520929eae4e8",
  apiKey: getQueryParameterByName("apiKey", url) || window.localStorage.getItem("apiKey") || "",
  functionSignature: window.localStorage.getItem("functionSignature") || "setAmount(uint)",
  functionParameters: window.localStorage.getItem("functionParameters") || "2000",
  address: getAddressFromPrivateKey(privateKey) || "",
  balance: "",
  rawTx: "",
});


// Show the built and sent transaction
function TransactionData({ state }) {
  return (
    <div>
      <hr />

      <h3>Transaction data</h3>

      <FormGroup controlId="rawTx">

        <Col componentClass={ControlLabel} sm={2}>
          Raw transaction
        </Col>

        <Col sm={10}>
          <FormControl componentClass="textarea" value={state.rawTx} disabled />
        </Col>

      </FormGroup>
    </div>
  )
}


function Signer() {

  function sendTransaction() {
    let rawTx = build
  }

  function onChange(event) {

    let name = event.target.id;
    let value = event.target.value;

    // Update state
    state[name] = value;
    console.log("Updated", name, value);

    // Store to survive refresh
    window.localStorage.setItem(name, value);
  }

  async function onPrivateKeyChange(event) {
    onChange(event);
    state.address = getAddressFromPrivateKey(state.privateKey) || "";
    updateBalance();
  }

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

      <AccountInfo state={state} />

      {state.rawTx && <TransactionData />}

    </Form>
  );
}

Signer.propTypes = {
  store: React.PropTypes.object,
};

export default observer(Signer);
