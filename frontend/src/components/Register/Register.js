import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
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

const validInputNames = [
  'firstName',
  'lastName',
  'email',
  'password',
  'password2',
];

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password2: '',
      error_firstName: '',
      error_lastName: '',
      error_email: '',
      error_password: '',
      error_password2: '',
      focused_firstName: false,
      focused_lastName: false,
      focused_email: false,
      focused_password: false,
      focused_password2: false,
      validated: false,
      show: true,
    };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.reroute = this.reroute.bind(this);
    this.setInputEmptyValidationMessage = this.setInputEmptyValidationMessage.bind(
      this
    );
    this.isValidInputName = this.isValidInputName.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.setInputFocus = this.setInputFocus.bind(this);
    this.isFormValidToSubmit = this.isFormValidToSubmit.bind(this);
    this.clearInputValidationMessage = this.clearInputValidationMessage.bind(
      this
    );
  }

  setInputEmptyValidationMessage(name) {
    this.setState({
      [`error_${name}`]: ErrorMessagingConstants.NAME_ATTRIBUTE_TO_ERROR_MAP
        .EMPTY[name],
    });
  }

  clearInputValidationMessage(name) {
    this.setState({
      [`error_${name}`]: '',
    });
  }

  setInputFocus(name) {
    let stateObj = {
      focused_firstName: name === 'firstName',
      focused_lastName: name === 'lastName',
      focused_email: name === 'email',
      focused_password: name === 'password',
      focused_password2: name === 'password2',
    };
    console.log(stateObj);
    this.setState(stateObj);
  }

  validateInput(name, value) {
    if (
      !isValidByRegexPattern(
        value,
        RegexPatternConstants.NAME_ATTRIBUTE_TO_PATTERN_MAP[name]
      )
    ) {
      this.setState({
        [`error_${name}`]: ErrorMessagingConstants.NAME_ATTRIBUTE_TO_ERROR_MAP
          .INVALID[name],
      });
    }
  }

  isValidInputName(name) {
    return validInputNames.includes(name);
  }

  isFormValidToSubmit() {
    validInputNames.forEach((inputName) => {
      if (this.state[`error_${inputName}`] || !this.state[`${inputName}`]) {
        return false;
      }
    });
    return true;
  }

  onChange(e) {
    try {
      if (this.isValidInputName(e.target.name)) {
        if (!e.target.value) {
          this.setState({ validated: false });
          this.setInputEmptyValidationMessage(e.target.name);
        } else {
          this.setState({ validated: true });
          this.clearInputValidationMessage(e.target.name);
        }

        if (e.target.name && e.target.value) {
          this.validateInput(e.target.name, e.target.value);
        }

        this.setState({ [e.target.name]: e.target.value });
      }
    } catch (err) {
      console.error(err);
    }
  }

  onFocus(e) {
    this.setState({ show: false });
    this.setInputFocus(e.target.name);
  }

  onBlur(e) {
    this.setState({ [`focused_${e.target.name}`]: false });
  }

  onSubmit(e) {
    console.log('HERE');
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.checkValidity() && this.isFormValidToSubmit()) {
      console.log('READY FOR TAKEOFF');
      this.setState({ validated: true });
      this.props.onRegisterFormSubmit(
        this.state.firstName,
        this.state.lastName,
        this.state.email,
        this.state.password,
        this.state.password2
      );
    } else {
      console.log('VALIDITY:', e.currentTarget.checkValidity());
      console.log('isFormValideToSubmit:', this.isFormValidToSubmit());
      this.setState({ validated: false });
    }
  }

  reroute(pathTo, pathFrom) {
    this.props.rerouteWithComponentLink(pathTo, pathFrom);
  }

  render() {
    const { from } = this.props.from || { from: '/login' };
    console.log('REGISTER PROPS: ', this.props);
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
              <FontAwesomeIcon icon={faUserPlus} />
              Register
            </h3>
            <Form onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label htmlFor="firstName">First Name</Form.Label>
                <Form.Control
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  autoComplete="given-name"
                  onChange={this.onChange}
                  onBlur={this.onBlur}
                  onFocus={this.onFocus}
                  required={true}
                />
                <Form.Control.Feedback
                  type="invalid"
                  className={
                    this.state.error_firstName && this.state.focused_firstName
                      ? ''
                      : 'visible'
                  }
                >
                  {this.state.error_firstName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="lastName">Last Name</Form.Label>

                <Form.Control
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  autoComplete="family-name"
                  onChange={this.onChange}
                  onBlur={this.onBlur}
                  onFocus={this.onFocus}
                  required={true}
                />
                <Form.Control.Feedback
                  type="invalid"
                  className={
                    this.state.error_lastName && this.state.focused_lastName
                      ? ''
                      : 'visible'
                  }
                >
                  {this.state.error_lastName}
                </Form.Control.Feedback>
              </Form.Group>
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
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  autoComplete="new-password"
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
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password2">Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  id="password2"
                  name="password2"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  onChange={this.onChange}
                  onBlur={this.onBlur}
                  onFocus={this.onFocus}
                  required={true}
                />
                <Form.Control.Feedback
                  type="invalid"
                  className={
                    this.state.error_password2 && this.state.focused_password2
                      ? ''
                      : 'visible'
                  }
                >
                  {this.state.error_password2}
                </Form.Control.Feedback>
              </Form.Group>
              <Button type="submit">Register</Button>
            </Form>
            <div className="section-thin">
              <small>
                <Button
                  className="button-as-link"
                  onClick={() => {
                    this.reroute('/login', '/forgot');
                  }}
                >
                  {'< Go Back'}
                </Button>
              </small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

Register.propTypes = {
  from: PropTypes.string.isRequired,
  userAuthState: PropTypes.string.isRequired,
  errorMessagePassedOn: PropTypes.string,
  successMessagePassedOn: PropTypes.string,
  rerouteWithComponentLink: PropTypes.func.isRequired,
  onRegisterFormSubmit: PropTypes.func.isRequired,
};
