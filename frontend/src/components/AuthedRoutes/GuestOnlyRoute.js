import { Component } from "react";
import { Route, Redirect } from "react-router-dom";

function GuestOnlyRoute({ component: Component, authState, user, ...rest }) {
  // const consoleLog = (p) => {
  //   console.log(p);
  //   return true;
  // };
  console.log("Guest");
  return (
    <Route
      {...rest}
      render={(props) =>
        authState === "guest" ? (
          <Component {...props} authState={authState} user={user} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location, authState, user: user },
            }}
          />
        )
      }
    />
  );
}

export default GuestOnlyRoute;
