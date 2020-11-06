import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

export default class Reset extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container className="card-container">
        <Card className="shadow-card">
          <Card.Body>
            <h3>
              <FontAwesomeIcon icon={faKey} />
              Reset Password
            </h3>
            <Form onSubmit={this.login}>
              <Form.Group>
                <Form.Label htmlFor="password">New Password</Form.Label>
                <Form.Control
                  type="password"
                  id="password"
                  placeholder="New Password"
                  autoComplete="new-password"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password2">Confirm Password</Form.Label>

                <Form.Control
                  type="password2"
                  id="password2"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                />
              </Form.Group>
              <Button type="submit">Reset</Button>
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
