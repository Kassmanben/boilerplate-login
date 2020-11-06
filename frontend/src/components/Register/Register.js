import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
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
                <a href="/">{"< Go back to login"}</a>
              </small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}
