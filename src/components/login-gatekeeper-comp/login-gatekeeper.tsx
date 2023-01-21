import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import FullSiteComp from "../full-site-comp/full-site-comp";

function LoginGatekeeper() {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
  } = useAuth0();
  //   alert(`isAuth ${isAuthenticated}, isLoading ${isLoading}`);
  if (isLoading) return <>Loading...</>;
  if (!isAuthenticated) {
    loginWithRedirect({ redirectUri: `${window.location.origin}/schedule` });
    return <>"Logging you in..."</>;
  } else {
    console.log("user!", user);
    getAccessTokenSilently().then((token) => console.log("token", token));
    return <FullSiteComp />;
  }
}

export default LoginGatekeeper;
