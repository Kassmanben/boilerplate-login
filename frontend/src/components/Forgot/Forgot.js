import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
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

export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      error_email: '',
      focused_email: false,
      validated: false,
      show: true,
    };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.reroute = this.reroute.bind(this);
  }

  onChange(e) {
    if (!e.target.value) {
      this.setState({ validated: false });
      if (e.target.name === 'email') {
        this.setState({
          error_email: ErrorMessagingConstants.VALIDATION.EMPTY_EMAIL,
        });
      }
    } else {
      this.setState({ validated: true });
      if (e.target.name === 'email') {
        this.setState({
          error_email: '',
        });
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
    this.setState({ show: false, focused_email: e.target.name === 'email' });
  }

  onBlur(e) {
    if (e.target.name === 'email') {
      this.setState({ focused_email: false });
    }
  }

  onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    if (
      event.currentTarget.checkValidity() === false ||
      this.state.error_email ||
      !this.state.email
    ) {
      console.log('INVALID');
      console.log('Validaity', event.currentTarget.checkValidity());
      console.log('EMAILERR: ', this.state.error_email);
      console.log('EMAIL: ', this.state.email);
      this.setState({ validated: false });
    } else {
      console.log('VALID');
      this.setState({ validated: true });
      this.props.onForgotFormSubmit(this.state.email);
    }
  }

  reroute(pathTo, pathFrom) {
    this.props.rerouteWithComponentLink(pathTo, pathFrom);
  }

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: '/login' },
    };
    console.log('FORGOT PROPS: ', this.props);
    let authState = this.props.userAuthState || 'guest';
    let errorMessagePassedOn = this.props.errorMessagePassedOn || '';
    let successMessagePassedOn = this.props.successMessagePassedOn || '';

    if (authState === 'loggedIn') {
      return <Redirect to={from} />;
    }

    if (
      this.props.onForgotFormSubmit === undefined ||
      this.props.rerouteWithComponentLink === undefined
    ) {
      console.log('NO FUNCTIONS');
      return <Redirect to={from} />;
    }

    return (
      <>
        {errorMessagePassedOn && (
          <AlertDismissible
            variant="danger"
            show={this.state.show}
            message={errorMessagePassedOn}
          />
        )}
        {successMessagePassedOn && (
          <AlertDismissible
            variant="danger"
            show={this.state.show}
            message={successMessagePassedOn}
          />
        )}
        <h5>
          <FontAwesomeIcon icon={faUnlockAlt} />
          Forgot Password
        </h5>
        <Container className="card-container">
          <Card className="shadow-card">
            <Card.Body>
              <Form onSubmit={this.onSubmit}>
                <div className="subtitle">
                  {
                    "Enter your email below and we'll send you a link to reset it."
                  }
                </div>
                <Form.Group>
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

                <Button type="submit">Send password reset email</Button>
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
      </>
    );
  }
}

Forgot.propTypes = {
  onForgotFormSubmit: PropTypes.func.isRequired,
  rerouteWithComponentLink: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  userAuthState: PropTypes.string.isRequired,
  errorMessagePassedOn: PropTypes.string,
  successMessagePassedOn: PropTypes.string,
};
