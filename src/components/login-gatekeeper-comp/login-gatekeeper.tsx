import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import FullSiteComp from "../full-site-comp/full-site-comp";
// import AppRootModelsContect from '../../App';
// import RootModel from '../../models/rootModel';

// export const AppRootModelsContext = new RootModel("token1");

function LoginGatekeeper() {
  const { getAccessTokenSilently } = useAuth0();
  console.log("We're inside LoginGatekeeper");
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
    // getAccessTokenSilently,
  } = useAuth0();
  //   alert(`isAuth ${isAuthenticated}, isLoading ${isLoading}`);
  if (isLoading) return <>Loading...</>;
  if (!isAuthenticated) {
    loginWithRedirect({ redirectUri: `${window.location.origin}/schedule` });
    // setUserToken("");
    // console.log("userToken: ", userToken);
    return <>"Logging you in..."</>;
  } else {
    console.log("user: ", user);

    getAccessTokenSilently().then((token) => {
      // function that update the global token state of this app.
      console.log("login gatekeeper token", token);
      // setUserToken(token);
      // AppRootModelsContext(token);
      // console.log("userToken: ", userToken);
    });
    return <FullSiteComp />;
  }
}

export default LoginGatekeeper;
