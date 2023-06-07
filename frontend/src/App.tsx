import { BrowserRouter } from "react-router-dom";
import PollkemonRoutes from "./PollkemonRoutes";
import { Auth0Provider } from "@auth0/auth0-react";

export default function App() {
  const domain = import.meta.env.VITE_APP_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_APP_AUTH0_CLIENT_ID;
  return (
    <BrowserRouter>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "https://dev-z3zlzuy1iirtsvpc.us.auth0.com/api/v2/",
          scope: "read:current_user update:current_user_metadata",
        }}
      >
        <div className="App">
          <PollkemonRoutes />
        </div>
      </Auth0Provider>
    </BrowserRouter>
  );
}
