import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import { validateByRegex } from '../../helpers/helperFunctions';
import * as ErrorMessagingConstants from '../../constants/error-messaging';
import * as RegexPatternConstants from '../../constants/regex-patterns';
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
        let isValid = validateByRegex(
          e.target.value,
          RegexPatternConstants.EMAIL_VALIDATION
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
    const form = event.currentTarget;
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
      this.props.onForgotFormSubmit(form, this.state.email);
    }
  }

  reroute(pathFrom, pathTo) {
    this.props.rerouteWithComponentLink(pathFrom, pathTo);
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    console.log('FORGOT PROPS: ', this.props);
    let authState = this.props.authState;
    let errorPassedOn = this.props.errorPassedOn || '';

    if (authState === 'loggedIn') {
      return <Redirect to={from} />;
    }

    return (
      <>
        {errorPassedOn && (
          <AlertDismissible show={true} message={errorPassedOn} />
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
                      this.reroute('/forgot', '/login');
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
  authState: PropTypes.string.isRequired,
  errorPassedOn: PropTypes.string,
};
