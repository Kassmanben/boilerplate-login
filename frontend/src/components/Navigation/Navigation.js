import React, { Component } from "react";
import PropTypes from "prop-types";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavItem from "react-bootstrap/NavItem";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { Route, Switch, Link, withRouter, Redirect } from "react-router-dom";
import Profile from "../Profile/Profile";
import Forgot from "../Forgot/Forgot";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Reset from "../Reset/Reset";
import Stories from "../Stories/Stories";
import axios from "axios";
import AuthOnlyRoute from "../AuthedRoutes/AuthOnlyRoute";
import GuestOnlyRoute from "../AuthedRoutes/GuestOnlyRoute";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      redirect: "",
      authState: "guest",
      isLoading: true,
      from: "/",
    };
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ from: prevProps.location.pathname });
      this.onRouteChanged();
    }
  }

  isStatusOk(status) {
    return (status > 199 && status < 300) || res.status === 304;
  }

  isEmptyObject(obj) {
    return Object.keys(obj).length == 0;
  }

  async authFunc() {
    this.setState({ isLoading: true });
    axios.get("/api/authState").then((res) => {
      try {
        if (this.isStatusOk(res.status) && !this.isEmptyObject(res.data.user)) {
          this.setState({
            user: res.data.user,
            authState: res.data.authState,
            isLoading: false,
          });
        } else {
          this.setState({
            user: {},
            authState: "guest",
            isLoading: false,
          });
        }
      } catch (err) {
        this.setState({
          user: {},
          authState: "guest",
          isLoading: false,
        });
        console.log(err);
      }
    });
  }

  async componentDidMount() {
    this.authFunc();
  }

  logOut = () => {
    axios
      .get("/api/auth/logout", { withCredentials: true })
      .then((res) => {
        this.setState({ user: {}, authState: "guest" });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ user: {}, authState: "guest" });
      });
  };

  async onRouteChanged() {
    this.authFunc();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    }

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
                <NavItem eventkey={6} href="/stories">
                  <Nav.Link as={Link} to="/stories">
                    Stories
                  </Nav.Link>
                </NavItem>
              </Nav>
              <Nav>
                {!this.state.isLoading && (
                  <NavItem eventkey={7}>
                    <Nav.Link as={Link} to="/">
                      {this.state.authState === "loggedIn"
                        ? "That's Auth Baby"
                        : "CRIME!"}
                    </Nav.Link>
                  </NavItem>
                )}

                {this.state.from && (
                  <NavItem eventkey={8}>
                    <Nav.Link as={Link} to={this.state.from}>
                      {this.state.from}
                    </Nav.Link>
                  </NavItem>
                )}
                <Button onClick={() => this.logOut()}>Logout</Button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
        <div>
          <Switch>
            <AuthOnlyRoute
              exact
              path="/"
              authState={this.state.authState}
              component={Profile}
              from={this.state.from}
              user={this.state.user}
            />
            <GuestOnlyRoute
              exact
              path="/forgot"
              authState={this.state.authState}
              component={Forgot}
              from={this.state.from}
            ></GuestOnlyRoute>
            <GuestOnlyRoute
              exact
              path="/login"
              authState={this.state.authState}
              component={Login}
              from={this.state.from}
            ></GuestOnlyRoute>
            <GuestOnlyRoute
              exact
              path="/register"
              authState={this.state.authState}
              component={Register}
              from={this.state.from}
            ></GuestOnlyRoute>
            <Route exact path="/reset" component={Reset}></Route>
            <AuthOnlyRoute
              exact
              path="/stories"
              authState={this.state.authState}
              component={Stories}
              from={this.state.from}
              user={this.state.user}
            />
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

export default withRouter(Navigation);
