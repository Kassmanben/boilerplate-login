import { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isEmptyObject, isStatusOk } from "../../helpers/helperFunctions";

function GuestOnlyRoute({ component: Component, ...rest }) {
  console.log("PERMISSIONS_ROUTE");

  console.log("rest", rest);
  let from = rest.from ? rest.from : "/";
  let user =
    rest.routePermissions.includes("loggedIn") &&
    rest.userAuthState == "loggedIn" &&
    !isEmptyObject(rest.user)
      ? rest.user
      : {};
  let invalidUserAuthRedirectPathname = rest.routePermissions.includes(
    "loggedIn"
  )
    ? "/login"
    : "/";

  //To account for werdness with Redirect props being in props.location.state
  let nestedStateProps = {};
  nestedStateProps = {
    state: {
      from: from,
      userAuthState: rest.userAuthState,
      user: user,
    },
  };

  console.log("nestedStateProps", nestedStateProps);
  console.log("toComp?", rest.routePermissions.includes(rest.userAuthState));
  console.log("whichComp", Component);
  console.log(
    "invalidUserAuthRedirectPathname",
    invalidUserAuthRedirectPathname
  );
  return (
    <Route
      {...rest}
      render={(props) =>
        rest.routePermissions.includes(rest.userAuthState) ? (
          <Component {...rest} location={nestedStateProps} />
        ) : (
          <Redirect
            to={{
              pathname: invalidUserAuthRedirectPathname,
              state: { from, userAuthState: rest.userAuthState, user },
            }}
          />
        )
      }
    />
  );
}

export default GuestOnlyRoute;