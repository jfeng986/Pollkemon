import LoginButton from "./components/Login";
import LogoutButton from "./components/Logout";
import Profile from "./components/Profile";
import Topics from "./components/Topics";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const { isLoading, error } = useAuth0();

  return (
    <div className="h-screen w-screen flex flex-col p-4">
      <div className="flex items-start justify-between">
        <h1 className="text-4xl">🄿🄾🄻🄻🄺🄴🄼🄾🄽</h1>
        <div className="text-right">
          {error && <p>Authentication Error</p>}
          {!error && isLoading && <p>Loading...</p>}
          {!error && !isLoading && (
            <>
              <LoginButton />
              <div className="flex">
                <Profile />
                <LogoutButton />
              </div>
            </>
          )}
        </div>
      </div>
      <div>
        <Topics />
      </div>
    </div>
  );
}
