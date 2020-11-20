import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookReader } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import * as ErrorMessagingConstants from "../../constants/error-messaging";
import * as RegexPatternConstants from "../../constants/regex-patterns";
import * as SuccessMessagingConstants from "../../constants/success-messaging";
import axios from "axios";
import AlertDismissible from "../Alert/AlertDismissible";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error_email: "",
      error_password: "",
      focused_email: false,
      focused_password: false,
      validated: false,
      show: true,
    };
  }

  validateByRegex = (text, pattern) => {
    return pattern.test(String(text).toLowerCase());
  };

  onChange = (e) => {
    if (!e.target.value) {
      this.setState({ validated: false });
      switch (e.target.name) {
        case "email":
          this.setState({
            error_email: ErrorMessagingConstants.VALIDATION.EMPTY_EMAIL,
          });
        case "password":
          this.setState({
            error_password: ErrorMessagingConstants.VALIDATION.EMPTY_PASSWORD,
          });
      }
    } else {
      this.setState({ validated: true });
      switch (e.target.name) {
        case "email":
          this.setState({
            error_email: "",
          });
        case "password":
          this.setState({
            error_password: "",
          });
      }
    }
    if (e.target.name && e.target.value) {
      if (e.target.name === "email") {
        let isValid = this.validateByRegex(
          e.target.value,
          RegexPatternConstants.EMAIL_VALIDATION
        );
        if (!isValid) {
          this.setState({
            error_email: ErrorMessagingConstants.VALIDATION.INVALID_EMAIL,
            validated: false,
          });
        } else {
          this.setState({ error_email: "" });
        }
      }
    }
  };

  onFocus = (e) => {
    this.setState({ show: false });
    if (e.target.name === "email") {
      this.setState({ focused_email: true, focused_password: false });
    } else if (e.target.name === "password") {
      this.setState({ focused_password: true, focused_email: false });
    } else {
      this.setState({ focused_password: false, focused_email: false });
    }
  };

  onBlur = (e) => {
    if (e.target.name === "email") {
      this.setState({ focused_email: false });
    } else if (e.target.name === "password") {
      this.setState({ focused_password: false });
    } else {
      this.setState({ focused_password: false, focused_email: false });
    }
  };

  onSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (
      event.currentTarget.checkValidity() === false ||
      (this.state.error_email && this.state.error_password) ||
      !this.state.email ||
      !this.state.password
    ) {
      this.setState({ validated: false });
    } else {
      this.setState({ validated: true });
      this.props.onLoginFormSubmit(form, this.state.email, this.state.password);
    }
  };

  onClose = (isShown) => {
    this.setState({ show: isShown });
  };

  onGoogleClick = () => {
    window.open(`http://localhost:8000/api/auth/google`, "_self");
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    console.log("LOGIN PROPS: ", this.props);
    let authState = this.props.authState || "guest";
    let loginError = this.props.loginError || "";

    if (authState === "loggedIn") {
      return <Redirect to={from} />;
    }

    return (
      <Container className="card-container">
        {loginError && (
          <AlertDismissible show={this.state.show} message={loginError} />
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
                      ? ""
                      : "visible"
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
                      ? ""
                      : "visible"
                  }
                >
                  {this.state.error_password}
                </Form.Control.Feedback>
                <Form.Text muted>
                  <Link to="/forgot">Forgot password?</Link>
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
                No Account? <a href="/register">Create your account</a>
              </small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}
