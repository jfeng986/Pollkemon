import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { httpClient } from "../services/HttpClient";

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);

  const payloadEmail = import.meta.env.VITE_PAYLOAD_EMAIL;
  const payloadUsername = import.meta.env.VITE_PAYLOAD_USERNAME;
  const domain = import.meta.env.VITE_APP_AUTH0_DOMAIN;

  useEffect(() => {
    const searchUserByEmail = async () => {
      const accessToken = await getAccessTokenSilently();
      try {
        const response = await httpClient.post(
          "/users",
          {
            username: username,
            email: userEmail,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setFoundUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (userEmail) {
      console.log("searching for user", userEmail);
      searchUserByEmail();
    }
  }, [user, userEmail]);

  useEffect(() => {
    if (foundUser) console.log(foundUser);
  }, [foundUser]);

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: "read:current_user",
          },
        });
        let payload = getPayloadFromToken(accessToken);
        console.log(payloadEmail);
        const email = payload[payloadEmail];
        const username = payload[payloadUsername];
        //console.log(email, username);
        if (user) {
          user.nickname = username;
          user.email = email;
        }
        console.log("user", user);
        setUsername(username);
        setUserEmail(email);
      } catch (e: any) {
        console.log(e.message);
      }
    };
    getUserMetadata();
  }, []);

  function getPayloadFromToken(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    //console.log(payload);
    return payload;
  }

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
