import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return !isAuthenticated ? (
    <div className="">
      <button
        onClick={() => loginWithRedirect()}
        className="btn btn-ghost text-base"
      >
        Log In
      </button>
    </div>
  ) : null;
};

export default LoginButton;
