import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

export default class Register extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    let authState = 'guest';
    if (this.props.location.state.authState) {
      authState = this.props.location.state.authState;
    } else if (this.props.authState) {
      authState = this.props.authState;
    }

    if (authState === 'loggedIn') {
      return <Redirect to={from} />;
    }

    return (
      <Container className="card-container">
        <Card className="shadow-card">
          <Card.Body>
            <h3>
              <FontAwesomeIcon icon={faUserPlus} />
              Register
            </h3>
            <Form onSubmit={this.login}>
              <Form.Group>
                <Form.Label htmlFor="firstName">First Name</Form.Label>
                <Form.Control
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  autoComplete="given-name"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="lastName">Last Name</Form.Label>

                <Form.Control
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  autoComplete="family-name"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  placeholder="Email"
                  autoComplete="username"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  type="password"
                  id="password"
                  placeholder="Enter Password"
                  autoComplete="current-password"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password2">Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  id="password2"
                  placeholder="Confirm Password"
                  autoComplete=""
                />
              </Form.Group>
              <Button type="submit">Register</Button>
            </Form>
            <div className="section-thin">
              <small>
                <a href="/">{'< Go back to login'}</a>
              </small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

Register.propTypes = {
  location: PropTypes.object.isRequired,
  authState: PropTypes.string.isRequired,
  errorPassedOn: PropTypes.string,
};
