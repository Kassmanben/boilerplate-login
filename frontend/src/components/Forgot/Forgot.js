import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlockAlt } from "@fortawesome/free-solid-svg-icons";

export default class Forgot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <h5>
          <FontAwesomeIcon icon={faUnlockAlt} />
          Forgot Password
        </h5>
        <Container className="card-container">
          <Card className="shadow-card">
            <Card.Body>
              <Form onSubmit={this.Forgot}>
                <div class="subtitle">
                  Enter your email below and we'll send you a link to reset it.
                </div>
                <Form.Group>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    autoComplete="username"
                  />
                </Form.Group>
                <Button type="submit">Send password reset email</Button>
              </Form>
              <div class="section-thin">
                <small>
                  <a href="/">{"< Go back"}</a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </>
    );
  }
}
