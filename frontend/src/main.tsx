import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";

const rootContainer: HTMLElement = document.getElementById(
  "root"
) as HTMLElement;
const root = ReactDOM.createRoot(rootContainer);

const domain = import.meta.env.VITE_APP_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_APP_AUTH0_CLIENT_ID;

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        //audience: "https://dev-z3zlzuy1iirtsvpc.us.auth0.com/api/v2/",
        //scope: "read:current_user update:current_user_metadata",
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
