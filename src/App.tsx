import {
  createTheme,
  responsiveFontSizes,
  MuiThemeProvider,
} from "@material-ui/core";

import React from "react";

import "./AppStyle/style.scss";
import { Auth0Provider } from "@auth0/auth0-react";
import LoginGatekeeper from "./components/login-gatekeeper-comp/login-gatekeeper";

function App() {
  // createTheme takes an options object as argument containing custom
  // colors or typography and return a new theme to the react components.
  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  return (
    <Auth0Provider
      domain="burn-logistics.eu.auth0.com"
      clientId="4WZq325FYt5dLHVacQ1tMCICDKSw04r5"
      redirectUri={window.location.origin}
    >
      <MuiThemeProvider theme={theme}>
        <LoginGatekeeper />
      </MuiThemeProvider>
    </Auth0Provider>
  );
}
/*




*/

export default App;
