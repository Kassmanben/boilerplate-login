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
      header_error: "",
      email: "",
      password: "",
      error_email: "",
      error_password: "",
      focused_email: false,
      focused_password: false,
      validated: false,
      show: false,
      user: {},
      loggedIn: false,
      redirect: "",
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

    if (
      e.target.name === "email" &&
      !this.validateByRegex(
        e.target.value,
        RegexPatternConstants.EMAIL_VALIDATION
      )
    ) {
      this.setState({
        error_email: ErrorMessagingConstants.VALIDATION.INVALID_EMAIL,
        validated: false,
      });
    } else {
      this.setState({ error_email: "" });
    }

    this.setState({ [e.target.name]: e.target.value });
  };

  onFocus = (e) => {
    this.setState({ header_error: "", show: false });

    if (e.target.name === "email") {
      this.setState({ focused_email: true });
    } else if (e.target.name === "password") {
      this.setState({ focused_password: true });
    }
  };

  onBlur = (e) => {
    if (e.target.name === "email") {
      this.setState({ focused_email: false });
    } else if (e.target.name === "password") {
      this.setState({ focused_password: false });
    }
  };

  onSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (
      form.checkValidity() === false ||
      (this.state.error_email && this.state.error_password)
    ) {
      this.setState({ validated: false });
    } else if (this.state.email && this.state.password) {
      this.setState({ validated: true });

      axios
        .post("/api/users/login", {
          email: this.state.email,
          password: this.state.password,
        })
        .then((res) => {
          if (res.status >= 200 && res.status < 300) {
            return res.data;
          } else if (res.status === 404) {
            this.setState({
              header_error: res.data.error,
              show: true,
            });
          } else {
            throw new Error("Sorry something went wrong");
          }
        })
        .then((data) => {
          try {
            this.setState({
              loggedIn: true,
              redirect: data.redirect,
              user: data.user,
            });
          } catch (err) {
            throw err;
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            header_error: err.message,
            show: true,
          });
        });
    }
  };

  onClose = (isShown) => {
    this.setState({ show: isShown });
  };

  render() {
    const { email, password } = this.state;
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    let authState = "guest";
    if (this.props.location.state.authState) {
      authState = this.props.location.state.authState;
    } else if (this.props.authState) {
      authState = this.props.authState;
    }

    if (authState === "loggedIn") {
      return <Redirect to={from} />;
    }

    return (
      <Container className="card-container">
        {this.state.show && (
          <AlertDismissible
            show={this.state.show}
            message={this.state.header_error}
          />
        )}
        {this.state.loggedIn ? (
          <Redirect
            to={{
              path: this.state.redirect,
              state: {
                user: this.state.user,
                stories: [{ title: "Test Title", id: "123" }],
              },
            }}
          />
        ) : null}

        <Card className="shadow-card">
          <Card.Body>
            <h3>
              <FontAwesomeIcon icon={faBookReader} />
              Storybooks
            </h3>
            <div>Create public and private stories from your life</div>
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
                    this.state.validated && !this.state.focused_password
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
            <Button href="/auth/google" className="red">
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
