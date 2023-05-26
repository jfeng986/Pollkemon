import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <button onClick={() => logout()} className="btn btn-ghost text-base">
      Log Out
    </button>
  ) : null;
};

export default LogoutButton;
