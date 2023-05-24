import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="mx-auto">Loading ...</div>;
  }

  return isAuthenticated && user ? (
    <div>
      <div>{JSON.stringify(user)}</div>
      <div className="flex justify-center">
        {user.picture && <img src={user.picture} alt={user.name} />}
      </div>
      <h2>{user.name}</h2>
      <ul>
        {Object.keys(user).map((objKey, i) => (
          <li key={i}>
            {objKey}: {user[objKey]}{" "}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default Profile;
