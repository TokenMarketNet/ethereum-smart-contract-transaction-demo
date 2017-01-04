import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Form, FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import { calculateNonce } from "../txbuilder";

@observer
class AccountInfo extends React.Component {

  constructor({state}) {
    super();
    this.state = state;
  }

  componentDidMount() {
    let state = this.state;
  }

  render() {

    let state = this.state;

    function increaseNonce() {
      state.nonceOffset++;
      state.nonce = calculateNonce(state.baseNonce, 0x100000, state.nonceOffset);
    }
    increaseNonce = action(increaseNonce);

    return (
      <div>
        <hr />

        <h3>Account information</h3>

        <FormGroup controlId="address">

          <Col componentClass={ControlLabel} sm={2}>
            Private key address
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.address} disabled />

            <p className="text-muted">
              Address from the private key. &nbsp;
              <a target="_blank" href={"https://testnet.etherscan.io/address/" + state.address}>View on EtherScan.io</a>.
            </p>
          </Col>

        </FormGroup>

        <FormGroup controlId="balance">

          <Col componentClass={ControlLabel} sm={2}>
            Account balance (ETH)
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.balance} disabled />

            <p className="text-muted">Balance the address of the private key holds.</p>
          </Col>

        </FormGroup>

        <FormGroup controlId="balance">

          <Col componentClass={ControlLabel} sm={2}>
            Next nonce
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.nonce} disabled />

            <p className="text-muted">Each transaction must have a nonce higher than previous one.</p>
          </Col>

        </FormGroup>

        <Button bsStyle="primary" onClick={increaseNonce}>
          Manually increase nonce
        </Button>

        <p className="text-muted">
          Helps to troubleshoot issues when sending multiple transactions sequentially.
        </p>

      </div>
    )
  }
}

export default AccountInfo;