import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookReader } from "@fortawesome/free-solid-svg-icons";
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
              <FontAwesomeIcon icon={faBookReader} />
              Storybooks
            </h3>
            <div>Create public and private stories from your life</div>
            <Form onSubmit={this.login}>
              <Form.Group>
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="username"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  id="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <Form.Text muted>
                  <Link to="/forgot">Forgot password?</Link>
                </Form.Text>
              </Form.Group>
              <Button type="submit">Login</Button>
            </Form>
            <div class="section-thin">or</div>
            <Button href="/auth/google" className="red">
              <FontAwesomeIcon icon={faGoogle} />
              Sign in with Google
            </Button>
            <div class="section-thin">
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
