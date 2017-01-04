/**
 * Show the built transaction info.
 */

import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Form, FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';


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

export default observer(TransactionData);