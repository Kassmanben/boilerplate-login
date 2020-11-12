import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import Card from "react-bootstrap/Card";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  handleShow() {
    this.setState({
      showModal: true,
    });
  }

  handleClose = () => {
    this.setState({
      showModal: false,
    });
  };

  render() {
    return (
      <>
        <Container className="main-container">
          <Row>
            <Col md={{ span: 4, order: 2 }} sm={{ span: 12, order: 1 }}>
              <Card>
                <Card.Body>
                  <h5 className="text-left">Profile</h5>
                  <Card.Text className="text-left">
                    {this.props.location.state.user.displayName}
                  </Card.Text>
                  <Card.Text className="text-left">
                    {this.props.location.state.user.permissions}
                  </Card.Text>
                  <Button className="icon-btn edit" onClick={this.handleShow}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={{ span: 8, order: 1 }} sm={{ span: 12, order: 1 }}>
              <h5 className="text-left">Stories</h5>
              <ListGroup>
                {this.props.location.state.stories.map(function (s) {
                  return (
                    <ListGroup.Item
                      className="d-flex justify-content-between align-items-center"
                      key={s.title}
                    >
                      <Link to={"/stories/" + s.id}>{s.title}</Link>
                      <div className="action-buttons">
                        <Link
                          to={"/stories/edit/" + s.id}
                          className="edit-link"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <Form className="delete-form">
                          <button className="icon-btn delete">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </Form>
                      </div>
                    </ListGroup.Item>
                  );
                })}
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span>Add a new story</span>
                  <div className="action-buttons">
                    <a className="add-link">
                      <FontAwesomeIcon icon={faPlus} />
                    </a>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
