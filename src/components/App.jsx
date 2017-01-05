import React from 'react';
import { observer } from 'mobx-react';
import Signer from './Signer';
import { Header, Navbar, Alert, Tabs, Tab, Grid, Row, Col } from 'react-bootstrap';
import logo from '../../images/logo.png';


@observer
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    let store = this.store;

    return (

      <Grid>
        <Row>
          <Col md={12}>

              <header>
                <Navbar>
                  <Navbar.Header>
                    <Navbar.Brand>
                      <a href="https://tokenmarket.net"><img className="logo" src={logo} /></a> Ethereum Transction Toy
                    </Navbar.Brand>
                  </Navbar.Header>
                </Navbar>
              </header>

           </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Signer />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <footer>
              <hr />
              <p className="text-center text-muted">
                <a href="https://tokenmarket.net">Copyright 2016 TokenMarket Ltd.</a>
              </p>
            </footer>
          </Col>
        </Row>
      </Grid>
    );
  }
}

App.propTypes = {
  store: React.PropTypes.object,
};

export default App;
