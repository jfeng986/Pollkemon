import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

type RouteParams = {
  pollId: string;
};

type PollOption = {
  Poll: number;
  id: number;
  option_name: number;
  created_at: string;
  updated_at: string;
};

const PollPage = () => {
  const { pollId } = useParams<RouteParams>();
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const getPollOptions = async () => {
      try {
        console.log("pollId", pollId);
        const response = await axios.post(`http://localhost:8081/poll`, {
          poll_id: pollId,
        });
        console.log("response.data", response.data);
        setPollOptions(response.data.options);
        console.log("pollOptions", pollOptions);
      } catch (error) {
        console.error(error);
      }
    };
    getPollOptions();
  }, []);

  const handlePollOptionClick = () => {};

  if (!isAuthenticated || !user) {
    loginWithRedirect();
    return null;
  }

  return (
    <div>
      <h1>Poll Page</h1>
      <div className="flex justify-center pt-8">
        <div className="flex flex-col max-w-screen-md">
          {pollOptions.map((pollOption) => (
            <div key={pollOption.id}>{pollOption.option_name}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PollPage;
