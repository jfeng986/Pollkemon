import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      setUsername(user?.nickname?.toString() || "");
      setUserEmail(user?.email?.toString() || "");
    };

    const searchUserByEmail = async () => {
      try {
        const response = await axios.post("http://localhost:8081/users", {
          username: username,
          email: userEmail,
        });
        setFoundUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
    if (userEmail) {
      console.log("searching for user", userEmail);
      searchUserByEmail();
    }
  }, [user, userEmail]);

  useEffect(() => {
    if (foundUser) console.log(foundUser);
  }, [foundUser]);

  return isAuthenticated && user ? (
    <div>
      <div className="flex justify-center">
        <div className="p-3">
          <p>㊔: {username}</p>
        </div>
      </div>
    </div>
  ) : null;
};

export default Profile;
