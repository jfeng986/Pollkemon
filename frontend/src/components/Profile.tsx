import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      setUserName(user?.nickname?.toString() || "");
      setUserEmail(user?.email?.toString() || "");
    };
    getUserData();
  }, [user]);

  return isAuthenticated && user ? (
    <div>
      <div className="flex justify-center">
        <div className="avatar">
          <div className="w-10 mask mask-hexagon">
            {user.picture && <img src={user.picture} alt={user.name} />}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Profile;
