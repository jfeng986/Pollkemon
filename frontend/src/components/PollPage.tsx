import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

type RouteParams = {
  pollID: string;
};

type PollOption = {
  Poll: number;
  id: number;
  option_name: number;
  created_at: string;
  updated_at: string;
  votes: number;
};

type Poll = {
  title: string;
  allow_multiple: boolean;
  created_at: string;
  updated_at: string;
  description: string;
  duration: number;
  is_active: boolean;
  is_permanent: boolean;
  votes: number;
};

const PollPage = () => {
  const { pollID } = useParams<RouteParams>();
  const [poll, setPoll] = useState<Poll>();
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  const getRandomColorClass = () => {
    const colors = [
      "text-orange-500",
      "text-pink-500",
      "text-teal-500",
      "text-red-500",
      "text-fuchsia-500",
      "text-rose-500",
      "text-blue-500",
      "text-yellow-500",
      "text-purple-500",
      "text-violet-500",
      "text-indigo-500",
      "text-sky-500",
      "text-gray-500",
      "text-cyan-500",
      "text-lime-500",
      "text-emerald-500",
      "text-amber-500",
      "text-lightBlue-500",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  useEffect(() => {
    const getPollOptions = async () => {
      try {
        console.log("pollID", pollID);
        const response = await axios.post(`http://localhost:8081/poll`, {
          poll_id: pollID,
        });
        console.log("response.data", response.data);
        const sortedOptions = response.data.options.sort(
          (a: PollOption, b: PollOption) => a.id - b.id
        );
        setPoll(response.data.poll);
        setPollOptions(sortedOptions);
        console.log("pollOptions", pollOptions);
      } catch (error) {
        console.error(error);
      }
    };
    getPollOptions();
  }, []);

  useEffect(() => {
    const totalVotes = pollOptions.reduce(
      (sum, option) => sum + option.votes,
      0
    );
    if (poll) {
      setPoll({ ...poll, votes: totalVotes });
    }
  }, [pollOptions]);

  const onPollOptionClick = async (option: PollOption) => {
    console.log("onPollOptionClick:", option.id);
    console.log("email:", user?.email);
    await axios.post(`http://localhost:8081/poll/vote`, {
      //user_email: user?.email,
      poll_id: pollID,
      option_id: option.id,
    });
    setPollOptions((prevOptions) =>
      prevOptions
        .map((prevOption) =>
          prevOption.id === option.id
            ? { ...prevOption, votes: prevOption.votes + 1 }
            : prevOption
        )
        .sort((a, b) => a.id - b.id)
    );
  };

  if (!isAuthenticated || !user) {
    loginWithRedirect();
    return null;
  }

  return (
    <div>
      <h1>{poll?.title}</h1>
      <p>{poll?.description}</p>
      <div className="flex justify-center pt-8">
        <div className="flex flex-col max-w-screen-md">
          {pollOptions.map((pollOption) => (
            <div key={pollOption.id} className="flex items-center mb-4">
              <div className="p-4 mr-4 bg-gray-200">
                {pollOption.option_name}
              </div>
              <div className="p-4 mr-4 bg-gray-200">{pollOption.votes}</div>
              <div
                className={`radial-progress ${getRandomColorClass()}`}
                style={
                  {
                    "--value": `${
                      poll?.votes ? (pollOption.votes / poll.votes) * 100 : 0
                    }`,
                  } as React.CSSProperties
                }
              >
                {((pollOption.votes / (poll?.votes || 0)) * 100).toFixed(2)}%
              </div>

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
