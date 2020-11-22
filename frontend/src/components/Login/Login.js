import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faBookReader } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Redirect } from 'react-router-dom';

import * as ErrorMessagingConstants from '../../constants/error-messaging';
import * as RegexPatternConstants from '../../constants/regex-patterns';
import { isValidByRegexPattern } from '../../helpers/helperFunctions';
import AlertDismissible from '../Alert/AlertDismissible';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error_email: '',
      error_password: '',
      focused_email: false,
      focused_password: false,
      validated: false,
      show: true,
    };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onGoogleClick = this.onGoogleClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.reroute = this.reroute.bind(this);
  }

  onChange(e) {
    if (!e.target.value) {
      this.setState({ validated: false });
      switch (e.target.name) {
        case 'email':
          this.setState({
            error_email: ErrorMessagingConstants.VALIDATION.EMPTY_EMAIL,
          });
          break;
        case 'password':
          this.setState({
            error_password: ErrorMessagingConstants.VALIDATION.EMPTY_PASSWORD,
          });
          break;
      }
    } else {
      this.setState({ validated: true });
      switch (e.target.name) {
        case 'email':
          this.setState({
            error_email: '',
          });
          break;
        case 'password':
          this.setState({
            error_password: '',
          });
          break;
      }
    }
    if (e.target.name && e.target.value) {
      if (e.target.name === 'email') {
        let isValid = isValidByRegexPattern(
          e.target.value,
          RegexPatternConstants.PATTERN.EMAIL_VALIDATION
        );
        if (!isValid) {
          this.setState({
            error_email: ErrorMessagingConstants.VALIDATION.INVALID_EMAIL,
            validated: false,
          });
        } else {
          this.setState({ error_email: '' });
        }
      }
    }

    this.setState({ [e.target.name]: e.target.value });
  }

  onFocus(e) {
    this.setState({ show: false });
    if (e.target.name === 'email') {
      this.setState({ focused_email: true, focused_password: false });
    } else if (e.target.name === 'password') {
      this.setState({ focused_password: true, focused_email: false });
    } else {
      this.setState({ focused_password: false, focused_email: false });
    }
  }

  onBlur(e) {
    if (e.target.name === 'email') {
      this.setState({ focused_email: false });
    } else if (e.target.name === 'password') {
      this.setState({ focused_password: false });
    } else {
      this.setState({ focused_password: false, focused_email: false });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    if (
      e.currentTarget.checkValidity() === false ||
      this.state.error_email ||
      this.state.error_password ||
      !this.state.email ||
      !this.state.password
    ) {
      this.setState({ validated: false });
    } else {
      this.setState({ validated: true });
      this.props.onLoginFormSubmit(this.state.email, this.state.password);
    }
  }

  onGoogleClick() {
    window.open(`http://localhost:8000/api/auth/google`, '_self');
  }

  reroute(pathTo, pathFrom) {
    this.props.rerouteWithComponentLink(pathTo, pathFrom);
  }

  render() {
    const { from } = this.props.from || { from: '/' };
    console.log('LOGIN PROPS: ', this.props);
    let authState = this.props.userAuthState || 'guest';
    let errorMessagePassedOn = this.props.errorMessagePassedOn || '';
    let successMessagePassedOn = this.props.successMessagePassedOn || '';

    if (authState === 'loggedIn') {
      return <Redirect to={from} />;
    }

    return (
      <Container className="card-container">
        {errorMessagePassedOn && (
          <AlertDismissible
            variant="danger"
            show={this.state.show}
            message={errorMessagePassedOn}
          />
        )}
        {successMessagePassedOn && (
          <AlertDismissible
            variant="success"
            show={this.state.show}
            message={successMessagePassedOn}
          />
        )}
        <Card className="shadow-card">
          <Card.Body>
            <h3>
              <FontAwesomeIcon icon={faBookReader} />
              Storybooks
            </h3>
            <Form onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="username"
                  onChange={this.onChange}
                  onBlur={this.onBlur}
                  onFocus={this.onFocus}
                  required={true}
                />
                <Form.Control.Feedback
                  type="invalid"
                  className={
                    this.state.error_email && this.state.focused_email
                      ? ''
                      : 'visible'
                  }
                >
                  {this.state.error_email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  onChange={this.onChange}
                  onBlur={this.onBlur}
                  onFocus={this.onFocus}
                  required={true}
                />
                <Form.Control.Feedback
                  type="invalid"
                  className={
                    this.state.error_password && this.state.focused_password
                      ? ''
                      : 'visible'
                  }
                >
                  {this.state.error_password}
                </Form.Control.Feedback>
                <Form.Text muted>
                  <Button
                    className="button-as-link"
                    onClick={() => {
                      this.reroute('/forgot', '/login');
                    }}
                  >
                    Forgot password?
                  </Button>
                </Form.Text>
              </Form.Group>
              <Button type="submit">Login</Button>
            </Form>
            <div className="section-thin">or</div>
            <Button onClick={this.onGoogleClick} className="red">
              <FontAwesomeIcon icon={faGoogle} />
              Sign in with Google
            </Button>
            <div className="section-thin">
              <small>
                No Account?{' '}
                <Button
                  className="button-as-link"
                  onClick={() => {
                    this.reroute('/register', '/login');
                  }}
                >
                  {'Create your account'}
                </Button>
              </small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

Login.propTypes = {
  onLoginFormSubmit: PropTypes.func.isRequired,
  rerouteWithComponentLink: PropTypes.func.isRequired,
  userAuthState: PropTypes.string.isRequired,
  errorMessagePassedOn: PropTypes.string,
  successMessagePassedOn: PropTypes.string,
  from: PropTypes.string.isRequired,
};
