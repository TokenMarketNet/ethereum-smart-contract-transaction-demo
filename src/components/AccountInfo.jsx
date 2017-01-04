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
  }

  render() {

    let state = this.state;

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

        <FormGroup controlId="balance">

          <Col componentClass={ControlLabel} sm={2}>
            Nonce
          </Col>

          <Col sm={10}>
            <FormControl type="text" value={state.nonce} disabled />

            <p className="text-muted">Automatically increased for each transaction.</p>
          </Col>

        </FormGroup>
      </div>
    )
  }
}

export default AccountInfo;