import { Component } from "react";
import { Route, Redirect } from "react-router-dom";

function AuthOnlyRoute({ component: Component, authState, user, ...rest }) {
  console.log("Auth");
  console.log("authState", authState);
  console.log("user", user);
  console.log("rest", rest);
  return (
    <Route
      {...rest}
      render={(props) =>
        authState === "loggedIn" ? (
          <Component {...props} authState={authState} user={user} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location, authState: authState, user: user },
            }}
          />
        )
      }
    />
  );
}

export default AuthOnlyRoute;
