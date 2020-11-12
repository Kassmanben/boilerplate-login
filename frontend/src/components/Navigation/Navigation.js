import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavItem from "react-bootstrap/NavItem";
import { Route, Switch, Link } from "react-router-dom";
import Profile from "../Profile/Profile";
import Forgot from "../Forgot/Forgot";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Reset from "../Reset/Reset";
import Stories from "../Stories/Stories";

export default class Navigation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>
          <Navbar expand="lg">
            <Navbar.Brand as={Link} to="/">
              Storybooks
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-menu" />
            <Navbar.Collapse id="navbar-menu">
              <Nav className="mr-auto">
                <NavItem eventkey={1} href="/">
                  <Nav.Link as={Link} to="/">
                    Home
                  </Nav.Link>
                </NavItem>
                <NavItem eventkey={2} href="/login">
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                </NavItem>
                <NavItem eventkey={3} href="/forgot">
                  <Nav.Link as={Link} to="/forgot">
                    Forgot
                  </Nav.Link>
                </NavItem>
                <NavItem eventkey={4} href="/register">
                  <Nav.Link as={Link} to="/register">
                    Register
                  </Nav.Link>
                </NavItem>
                <NavItem eventkey={5} href="/reset">
                  <Nav.Link as={Link} to="/reset">
                    Reset
                  </Nav.Link>
                </NavItem>
                <NavItem eventkey={5} href="/stories">
                  <Nav.Link as={Link} to="/stories">
                    Stories
                  </Nav.Link>
                </NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
        <div>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => <Profile {...props} />}
            ></Route>
            <Route exact path="/forgot" component={Forgot}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/reset" component={Reset}></Route>
            <Route exact path="/stories" component={Stories}></Route>
            <Route
              render={function () {
                return <p>Not found</p>;
              }}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
