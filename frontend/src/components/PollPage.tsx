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
  colorClass: string;
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
  const [checkedOptions, setCheckedOptions] = useState<number[]>([]);
  const [remainHours, setRemainHours] = useState(0);
  const [remainMinutes, setRemainMinutes] = useState(0);
  const [remainSeconds, setRemainSeconds] = useState(0);
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
    if (poll && poll.is_active) {
      if (poll.is_permanent || poll.duration === -1) {
        console.log("permanent");
        return;
      }
      const endTime = new Date(poll.created_at);
      endTime.setMinutes(endTime.getMinutes() + poll.duration);
      const remainTime = endTime.getTime() - new Date().getTime();
      setRemainHours(Math.floor((remainTime / (1000 * 60 * 60)) % 24));
      setRemainMinutes(Math.floor((remainTime / (1000 * 60)) % 60));
      setRemainSeconds(Math.floor((remainTime / 1000) % 60));
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = endTime.getTime() - now;
        if (timeLeft < 0) {
          clearInterval(interval);
          window.location.reload();
        } else {
          setRemainHours(Math.floor((timeLeft / (1000 * 60 * 60)) % 24));
          setRemainMinutes(Math.floor((timeLeft / (1000 * 60)) % 60));
          setRemainSeconds(Math.floor((timeLeft / 1000) % 60));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [poll]);

  const handleCheckboxChange = (optionId: number, isChecked: boolean) => {
    if (isChecked) {
      setCheckedOptions([...checkedOptions, optionId]);
    } else {
      setCheckedOptions(checkedOptions.filter((id) => id !== optionId));
    }
  };

  const handleVoteClick = () => {
    if (checkedOptions.length === 0) {
      alert("Please select at least one option");
      return;
    }
    checkedOptions.forEach((optionId) => {
      const option = pollOptions.find((o) => o.id === optionId);
      if (option) {
        onPollOptionClick(option);
      }
    });
    setCheckedOptions([]);
    window.location.reload();
  };

  useEffect(() => {
    const getPollOptions = async () => {
      try {
        console.log("pollID", pollID);
        const response = await axios.post(`http://localhost:8081/poll`, {
          poll_id: pollID,
        });
        console.log("response.data", response.data);
        const sortedOptions = response.data.options
          .sort((a: PollOption, b: PollOption) => a.id - b.id)
          .map((option: PollOption) => ({
            ...option,
            colorClass: getRandomColorClass(),
          }));
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
      <h1 className="p-4 text-2xl flex justify-between">
        {poll?.title} #{pollID}
        <p className={`kbd kbd-lg px-4 py-2 ${poll?.is_active}`}>
          {poll?.is_active ? "🌻Open" : "🥀Closed"}
        </p>
      </h1>
      <div className="p-2 px-4">
        <p>
          Description:{" "}
          <span>
            {poll?.description ? poll.description : "No description available"}
          </span>
        </p>
        <p> Created at: {poll?.created_at}</p>

        <p>
          {" "}
          Remaining Time:{" "}
          <span className="countdown font-mono text-2xl">
            <span style={{ "--value": remainHours } as React.CSSProperties}>
              {remainHours}
            </span>
            h
            <span style={{ "--value": remainMinutes } as React.CSSProperties}>
              {remainMinutes}
            </span>
            m
            <span style={{ "--value": remainSeconds } as React.CSSProperties}>
              {remainSeconds}
            </span>
            s
          </span>
        </p>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr className="align-cenetr">
              <th></th>
              <th>Options</th>
              <th>Votes</th>
              <th>Percentage</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pollOptions.map((pollOption, index) => (
              <tr key={pollOption.id} className="hover">
                <td className="">{String.fromCharCode(97 + index)}</td>
                <td>
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="font-bold opacity-80">
                        {pollOption.option_name}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="opacity-80">{pollOption.votes}</div>
                </td>

                <td>
                  <div
                    className={`radial-progress ${pollOption.colorClass}`}
                    style={
                      {
                        "--value": `${
                          poll?.votes
                            ? (pollOption.votes / poll.votes) * 100
                            : 0
                        }`,
                      } as React.CSSProperties
                    }
                  >
                    {((pollOption.votes / (poll?.votes || 0)) * 100).toFixed(2)}
                    %
                  </div>
                </td>
                <td>Detail</td>

                <td>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(pollOption.id, e.target.checked)
                      }
                      disabled={!poll?.is_active}
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center p-4">
          <button
            className="btn btn-ghost text-2xl"
            onClick={handleVoteClick}
            disabled={!poll?.is_active}
          >
            Vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollPage;
