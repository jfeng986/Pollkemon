import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";
import Topics from "./components/Topics";
import Polls from "./components/Polls"; // Assuming this is the path to your Polls component
import { useAuth0 } from "@auth0/auth0-react";
import PollPage from "./components/PollPage";

export default function AppRoutes() {
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
      <div></div>
      <Routes>
        <Route path="/" element={<Topics />} />
        <Route path="/topic/:topicId" element={<Polls />} />
        <Route path="/poll/:pollId" element={<PollPage />} />
      </Routes>
    </div>
  );
}
