import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavItem from 'react-bootstrap/NavItem';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import Profile from '../Profile/Profile';
import Forgot from '../Forgot/Forgot';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Reset from '../Reset/Reset';
import Stories from '../Stories/Stories';
import axios from 'axios';
import PermissionsRoute from '../AuthedRoutes/PermissionsRoute';
import { isEmptyObject, isStatusOk } from '../../helpers/helperFunctions';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userAuthState: 'guest',
      isLoading: true,
      from: '/',
      errorPassedOn: '',
      changeState: false,
    };
    this.authFunc = this.authFunc.bind(this);
    this.logout = this.logout.bind(this);
    this.onForgotFormSubmit = this.onForgotFormSubmit.bind(this);
    this.onLoginFormSubmit = this.onLoginFormSubmit.bind(this);
  }

  async authFunc() {
    console.log('AUTH');
    this.setState({ isLoading: true });
    axios.get('/api/authState').then((res) => {
      try {
        if (isStatusOk(res.status) && !isEmptyObject(res.data.user)) {
          this.setState({
            user: res.data.user,
            userAuthState: res.data.authState,
            isLoading: false,
          });
        } else if (res.status !== 304) {
          this.setState({
            user: {},
            userAuthState: 'guest',
            isLoading: false,
          });
        }
      } catch (err) {
        this.setState({
          user: {},
          userAuthState: 'guest',
          isLoading: false,
        });
        console.log(err);
      }
    });
  }

  async componentDidMount() {
    console.log('MOUNT');
    this.authFunc();
  }

  logout() {
    axios
      .get('/api/auth/logout', { withCredentials: true })
      .then(() => {
        this.setState({ user: {}, userAuthState: 'guest' });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ user: {}, userAuthState: 'guest' });
      });
  }

  onLoginFormSubmit(email, password) {
    console.log('LOGIN BY FORM');
    this.setState({ isLoading: true });
    axios
      .post('/api/users/login', {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log('LOGIN RES: ', res);
        try {
          if (isStatusOk(res.status)) {
            if (!isEmptyObject(res.data.user)) {
              console.log(res.data);
              this.setState({
                user: res.data.user,
                userAuthState: res.data.authState,
                isLoading: false,
              });
            } else {
              console.log('404 res: ', res);
              this.setState({
                errorPassedOn: res.data.error,
                user: {},
                userAuthState: 'guest',
                isLoading: false,
              });
            }
          }
        } catch (err) {
          console.log('ERROR');
          this.setState({
            user: {},
            userAuthState: 'guest',
            isLoading: false,
          });
          console.log(err);
        }
      });
  }

  onForgotFormSubmit(email) {
    console.log('FORGOT BY FORM');
    console.log('EMAIL: ', email);
    this.setState({ isLoading: true });
    axios
      .post('/api/users/forgot', {
        email: email,
      })
      .then((res) => {
        console.log('FORGOT RES: ', res);
        try {
          if (isStatusOk(res.status)) {
            console.log(res.data);
            this.setState({
              user: res.data.user,
              userAuthState: res.data.authState,
              isLoading: false,
            });
            this.rerouteWithComponentLink('/forgot', '/login');
          }
        } catch (err) {
          console.log('ERROR');
          this.setState({
            user: {},
            userAuthState: 'guest',
            isLoading: false,
          });
          console.log(err);
          this.rerouteWithComponentLink('/forgot', '/login');
        }
      });
  }

  rerouteWithComponentLink(setFrom, setTo) {
    console.log('HISTORY:', this.props.history);
    this.setState({ from: setFrom + '#' }, () => {
      this.props.history.push(setTo);
    });
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
                  <Nav.Link
                    as={Link}
                    onClick={() => {
                      this.setState({ from: '/' });
                    }}
                    to="/"
                  >
                    Home
                  </Nav.Link>
                </NavItem>
                <NavItem eventkey={2} href="/login">
                  <Nav.Link
                    as={Link}
                    onClick={() => {
                      this.setState({ from: '/login' });
                    }}
                    to="/login"
                  >
                    Login
                  </Nav.Link>
                </NavItem>
                <NavItem eventkey={3} href="/forgot">
                  <Nav.Link
                    as={Link}
                    onClick={() => {
                      this.setState({ from: '/forgot' });
                    }}
                    to="/forgot"
                  >
                    Forgot
                  </Nav.Link>
                </NavItem>
                <NavItem eventkey={4} href="/register">
                  <Nav.Link
                    as={Link}
                    onClick={() => {
                      this.setState({ from: '/register' });
                    }}
                    to="/register"
                  >
                    Register
                  </Nav.Link>
                </NavItem>
                <NavItem eventkey={5} href="/reset">
                  <Nav.Link
                    as={Link}
                    onClick={() => {
                      this.setState({ from: '/reset' });
                    }}
                    to="/reset"
                  >
                    Reset
                  </Nav.Link>
                </NavItem>
                <NavItem eventkey={6} href="/stories">
                  <Nav.Link
                    as={Link}
                    onClick={() => {
                      this.setState({ from: '/stories' });
                    }}
                    to="/stories"
                  >
                    Stories
                  </Nav.Link>
                </NavItem>
              </Nav>
              <Nav>
                {!this.state.isLoading && (
                  <NavItem eventkey={7}>
                    <Nav.Link as={Link} to="/">
                      {this.state.userAuthState === 'loggedIn'
                        ? "That's Auth Baby"
                        : 'CRIME!'}
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
                <Button onClick={() => this.logout()}>Logout</Button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
        <div>
          <Switch>
            <PermissionsRoute
              exact
              path="/"
              userAuthState={this.state.userAuthState}
              component={Profile}
              from={this.state.from}
              user={this.state.user}
              rerouteWithComponentLink={this.rerouteWithComponentLink}
              routePermissions={['loggedIn']}
            />
            <PermissionsRoute
              exact
              path="/forgot"
              userAuthState={this.state.userAuthState}
              component={Forgot}
              from={this.state.from}
              user={this.state.user}
              onForgotFormSubmit={this.onForgotFormSubmit}
              rerouteWithComponentLink={this.rerouteWithComponentLink}
              errorPassedOn={this.state.errorPassedOn}
              routePermissions={['guest']}
            ></PermissionsRoute>
            <PermissionsRoute
              exact
              path="/login"
              userAuthState={this.state.userAuthState}
              component={Login}
              from={this.state.from}
              user={this.state.user}
              onLoginFormSubmit={this.onLoginFormSubmit}
              rerouteWithComponentLink={this.rerouteWithComponentLink}
              errorPassedOn={this.state.errorPassedOn}
              routePermissions={['guest']}
            ></PermissionsRoute>
            <PermissionsRoute
              exact
              path="/register"
              userAuthState={this.state.userAuthState}
              component={Register}
              from={this.state.from}
              user={this.state.user}
              rerouteWithComponentLink={this.rerouteWithComponentLink}
              routePermissions={['guest']}
            ></PermissionsRoute>
            <Route exact path="/reset" component={Reset}></Route>
            <PermissionsRoute
              exact
              path="/stories"
              userAuthState={this.state.userAuthState}
              component={Stories}
              from={this.state.from}
              user={this.state.user}
              rerouteWithComponentLink={this.rerouteWithComponentLink}
              routePermissions={['loggedIn']}
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

Navigation.propTypes = {
  history: PropTypes.object.isRequired,
};
