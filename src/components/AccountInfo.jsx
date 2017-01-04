import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Form, FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';

import { API } from "../etherscan";


@observer
class AccountInfo extends React.Component {

  constructor({state}) {
    super();
    this.state = state;
  }

  componentDidMount() {

    let state = this.state;

    // Update the Ethereum address balanc from etherscan.io API
    async function updateBalance() {

      function setBalance(balance) {
        console.log("New balance is ", balance);
        state.balance = balance;
      }
      setBalance = action(setBalance);

      if(!state.address || !state.apiKey) {
        // No address available
        return;
      }
      const api = new API(state.apiURL, state.apiKey);
      const balance = await api.getBalance(state.address);

      if(balance !== null) {
        setBalance(balance);
      } else {
        setBalance("");
      }
    }
    updateBalance();
  }

  render() {

    let state = this.state;

    return (
      <div>
        <hr />

        <h3>Account information</h3>

        <FormGroup controlId="address">

          <Col componentClass={ControlLabel} sm={2}>
            Address
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.address} disabled />

            <p className="text-muted">Address from the private key</p>
          </Col>

        </FormGroup>

        <FormGroup controlId="balance">

          <Col componentClass={ControlLabel} sm={2}>
            Account balance (ETH)
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.balance} disabled />

            <p className="text-muted">Automatically fetches the Ethereum account.</p>
          </Col>

        </FormGroup>
      </div>
    )
  }
}

export default AccountInfo;