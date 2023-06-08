import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { httpClient } from "../services/HttpClient";
import { PollRouteParams, PollOption, Poll } from "../Types";
import { RandomColorClass } from "../assets/Color";

const PollPage = () => {
  const { pollID } = useParams<PollRouteParams>();
  const [poll, setPoll] = useState<Poll>();
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [checkedOptions, setCheckedOptions] = useState<number[]>([]);
  const [remainHours, setRemainHours] = useState(0);
  const [remainMinutes, setRemainMinutes] = useState(0);
  const [remainSeconds, setRemainSeconds] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const { user, isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
    useAuth0();

  if (!isAuthenticated || !user) {
    loginWithRedirect();
    return null;
  }

  useEffect(() => {
    const getPollOptions = async () => {
      try {
        const accessToken = await getAccessTokenSilently();

        const response = await httpClient.post(
          `/poll`,
          {
            poll_id: pollID,
            email: user.email,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const sortedOptions = response.data.options
          .sort((a: PollOption, b: PollOption) => a.id - b.id)
          .map((option: PollOption) => ({
            ...option,
            colorClass: RandomColorClass(),
          }));
        setPoll(response.data.poll);
        setPollOptions(sortedOptions);
        const theUser = response.data.user;
        if (theUser?.voted_polls.map(Number).includes(Number(pollID))) {
          setHasVoted(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getPollOptions();
  }, [pollID, user?.email]);

  useEffect(() => {
    const totalVotes = pollOptions.reduce(
      (sum, option) => sum + option.votes,
      0
    );
    if (poll) {
      setPoll({ ...poll, votes: totalVotes });
    }
  }, [pollOptions]);

  useEffect(() => {
    if (poll && poll.is_active) {
      if (poll.is_permanent && poll.is_active) {
        let runCountDown = true;
        const interval = setInterval(() => {
          setRemainHours(runCountDown ? 12 : 99);
          setRemainMinutes(runCountDown ? 34 : 99);
          setRemainSeconds(runCountDown ? 56 : 99);
          runCountDown = !runCountDown;
        }, 1500);
        return () => clearInterval(interval);
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
      if (poll?.allow_multiple) {
        setCheckedOptions([...checkedOptions, optionId]);
      } else {
        setCheckedOptions([optionId]);
      }
    } else {
      setCheckedOptions(checkedOptions.filter((id) => id !== optionId));
    }
  };

  const handleVoteClick = async () => {
    if (checkedOptions.length === 0) {
      alert("Please select at least one option");
      return;
    }
    for (const optionId of checkedOptions) {
      const option = pollOptions.find((o) => o.id === optionId);
      if (option) {
        await onPollOptionClick(option);
      }
    }
    setCheckedOptions([]);
    setHasVoted(true);
  };

  const onPollOptionClick = async (option: PollOption) => {
    const accessToken = await getAccessTokenSilently();
    console.log("accessToken", accessToken);
    const response = await httpClient.post(
      `/poll/vote`,
      {
        email: user?.email,
        poll_id: pollID,
        option_id: option.id,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const updatedOption = response.data;
    const users = updatedOption.users;
    setPollOptions((prevOptions) =>
      prevOptions
        .map((prevOption) =>
          prevOption.id === option.id
            ? { ...prevOption, votes: prevOption.votes + 1, users: users }
            : prevOption
        )
        .sort((a, b) => a.id - b.id)
    );
  };

  return (
    <div>
      <h1 className="pt-8 px-8 pb-2 text-2xl flex justify-between">
        <div className="flex items-center font-semibold">
          ㊠: {poll?.title} #{pollID}
        </div>
        <div className="flex flex-col">
          <div className="kbd kbd-lg px-4">
            {poll?.is_active ? "🌻Open" : "🥀Closed"}
          </div>
          <div className="flex justify-center pt-2">
            <span className="countdown font-mono text-lg ">
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
          </div>
        </div>
      </h1>
      <div className="pb-4 px-8">
        <p className="text-xl">
          <span>
            Description:{" "}
            {poll?.description ? poll.description : "No description available"}
          </span>
        </p>
        <p>
          {poll?.allow_multiple ? "Multiple Selection" : "Single Selection"}
        </p>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr className="align-cenetr ">
              <th></th>
              <th className="text-base">Options</th>
              <th className="text-base">Votes</th>
              <th className="text-base">Percentage</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pollOptions.map((pollOption, index) => (
              <tr key={pollOption.id} className="hover">
                <td className="">{String.fromCharCode(65 + index)}</td>
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
                <td>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={checkedOptions.includes(pollOption.id)}
                      onChange={(e) =>
                        handleCheckboxChange(pollOption.id, e.target.checked)
                      }
                      disabled={!poll?.is_active || hasVoted}
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
            disabled={!poll?.is_active || hasVoted}
          >
            {hasVoted ? "You Have Voted" : "Vote"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollPage;
