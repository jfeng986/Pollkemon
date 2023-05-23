import LoginButton from "./components/Login";
import LogoutButton from "./components/Logout";
import Profile from "./components/Profile";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const { isLoading, error } = useAuth0();

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <h1>Auth0 Login</h1>
        {error && <p>Authentication Error</p>}
        {!error && isLoading && <p>Loading...</p>}
        {!error && !isLoading && (
          <>
            <LoginButton />
            <LogoutButton />
            <Profile />
          </>
        )}
      </div>
    </div>
  );
}
