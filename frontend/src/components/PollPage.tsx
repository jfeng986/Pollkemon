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
  votes: number;
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
        const sortedOptions = response.data.options.sort(
          (a: PollOption, b: PollOption) => a.id - b.id
        );
        setPollOptions(sortedOptions);
        console.log("pollOptions", pollOptions);
      } catch (error) {
        console.error(error);
      }
    };
    getPollOptions();
  }, []);

  const onPollOptionClick = async (option: PollOption) => {
    console.log("onPollOptionClick:", option.id);
    console.log("email:", user?.email);
    await axios.post(`http://localhost:8081/poll/vote`, {
      poll_id: pollId,
      option_id: option.id,
    });
    setPollOptions(
      (prevOptions) =>
        prevOptions
          .map((prevOption) =>
            prevOption.id === option.id
              ? { ...prevOption, votes: prevOption.votes + 1 }
              : prevOption
          )
          .sort((a, b) => a.id - b.id) // sort by id
    );
  };

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
            <div key={pollOption.id} className="flex items-center mb-4">
              <div className="p-4 mr-4 bg-gray-200">
                {pollOption.option_name}
              </div>
              <div className="p-4 mr-4 bg-gray-200">{pollOption.votes}</div>
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={() => onPollOptionClick(pollOption)}
              >
                Vote
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PollPage;
