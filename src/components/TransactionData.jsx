/**
 * Show the built transaction info.
 */

import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Form, FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';


function TransactionData({ state }) {

  const sendInfo = state.sendStatus || state.sentTxHash || state.sendError;

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

          <p className="text-muted">
            If you are doing offline signing you can manually copy-paste this transaction to <a href="https://testnet.etherscan.io">pushTx</a>.
          </p>
        </Col>

      </FormGroup>

      {sendInfo &&
        <FormGroup controlId="rawTx">

          <Col componentClass={ControlLabel} sm={2}>
            Send status
          </Col>

          <Col sm={10}>
            {state.sendStatus && <div><i className="fa fa-spin fa-spinner" /> Sending</div>}
            {state.sendError && <div className="text-danger">Transaction error: {state.sendError}</div>}
            {state.sentTxHash && <div>Transaction sent: <a target="_blank" href={"https://testnet.etherscan.io/tx/" + state.sentTxHash}>{state.sentTxHash}</a>. It may take up to one minute for the transaction to appear in the blockchain explorer.</div>}
          </Col>

        </FormGroup>
      }
    </div>
  )
}

export default observer(TransactionData);