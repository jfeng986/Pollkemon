import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { httpClient } from "../services/HttpClient";
import { Poll } from "../Types";
import { TopicRouteParams } from "../Types";

const Polls = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const { topicID, topicName } = useParams<TopicRouteParams>();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newPollName, setNewPollName] = useState("");
  const [newPollDescription, setNewPollDescription] = useState("");
  const [newPollDurationHour, setNewPollDurationHour] = useState(0);
  const [newPollDurationMinute, setNewPollDurationMinute] = useState(0);
  const [newPollDuration, setNewPollDuration] = useState(0);
  const [isPermanent, setIsPermanent] = useState(false);
  const [newPollAllowMultiple, setNewPollAllowMultiple] = useState(false);
  const [newPollOptions, setNewPollOptions] = useState<string>();
  const [sortOrder, setSortOrder] = useState<"newest" | "popularity">("newest");

  if (!isAuthenticated || !user) {
    loginWithRedirect();
    return null;
  }

  useEffect(() => {
    const getPolls = async () => {
      try {
        const response = await httpClient.post(`/topic/polls`, {
          topic_id: topicID,
        });
        const pollsWithUserNames = await Promise.all(
          response.data.map(async (poll: Poll) => {
            const created_by_user = await getUserName(poll.created_by);
            return { ...poll, created_by_user };
          })
        );
        let sortedPolls;
        if (sortOrder === "newest") {
          sortedPolls = pollsWithUserNames.sort(
            (a: Poll, b: Poll) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          );
        } else {
          sortedPolls = pollsWithUserNames.sort(
            (a: Poll, b: Poll) => b.votes - a.votes
          );
        }
        setPolls(sortedPolls);
      } catch (error) {
        console.error(error);
      }
    };
    getPolls();
  }, [sortOrder]);

  useEffect(() => {
    if (newPollDurationHour === 0 && newPollDurationMinute === 0) {
      setIsPermanent(true);
      setNewPollDuration(-1);
    } else {
      setIsPermanent(false);
      setNewPollDuration(newPollDurationHour * 60 + newPollDurationMinute);
    }
  }, [newPollDurationHour, newPollDurationMinute]);

  const getUserName = async (id: number) => {
    try {
      const response = await httpClient.post(`/users/searchid`, { id });
      return response.data.username;
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const onCreatePollClick = async () => {
    let newPollOptionsArray = newPollOptions
      ?.split(";")
      .filter((option) => option.trim() !== "");
    console.log(newPollOptionsArray?.length);
    if (newPollName.trim() === "") {
      alert("Poll name cannot be empty");
      return;
    } else if (newPollOptionsArray?.length === 0 || !newPollOptionsArray) {
      alert("Poll must have at least one option");
      return;
    } else if (newPollDurationHour < 0 || newPollDurationMinute < 0) {
      alert("Poll duration must be greater than 0");
      return;
    }
    try {
      await httpClient.post("/polls", {
        title: newPollName,
        description: newPollDescription,
        topic: topicID,
        created_by: user.email,
        is_permanent: isPermanent,
        duration: newPollDuration,
        is_active: true,
        allow_multiple: newPollAllowMultiple,
        options: newPollOptionsArray,
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  return (
    <div>
      <div className="flex justify-between p-8 text-center items-center">
        <div className="flex justify-center">
          <label htmlFor="my-modal" className="btn btn-outline opacity-80">
            Create Poll
          </label>
          <input type="checkbox" id="my-modal" className="modal-toggle " />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-2xl flex justify-center">
                Poll Name:
              </h3>
              <div className="flex justify-center">
                <input
                  type="text"
                  placeholder="Type here"
                  className="input w-full max-w-xs input-bordered "
                  value={newPollName}
                  onChange={(e) => setNewPollName(e.target.value)}
                />
              </div>
              <h3 className="font-bold text-2xl flex justify-center pt-4">
                Description:
              </h3>
              <div className="flex justify-center">
                <input
                  type="text"
                  placeholder="Type here"
                  className="input w-full max-w-xs input-bordered "
                  value={newPollDescription}
                  onChange={(e) => setNewPollDescription(e.target.value)}
                />
              </div>
              <h3 className="font-bold text-2xl flex justify-center pt-4">
                Duration - remain 0 if permanent:
              </h3>
              <div className="flex justify-center p-1">
                <p className="pr-2 font-bold">Hour: </p>
                <input
                  type="number"
                  className="w-1/2"
                  value={newPollDurationHour}
                  onChange={(e) =>
                    setNewPollDurationHour(Number(e.target.value))
                  }
                />
              </div>
              <div className="flex justify-center p-1">
                <p className="pr-2 font-bold">Minute: </p>
                <input
                  type="number"
                  className="w-1/2 "
                  value={newPollDurationMinute}
                  onChange={(e) =>
                    setNewPollDurationMinute(Number(e.target.value))
                  }
                />
              </div>
              <h3 className="font-bold text-2xl flex justify-center pt-4">
                Allow Multiple:
              </h3>
              <div className="flex justify-center pt-4">
                <label className="swap">
                  <input
                    type="checkbox"
                    checked={newPollAllowMultiple}
                    onChange={(e) => setNewPollAllowMultiple(e.target.checked)}
                  />
                  <div className="swap-on">YES</div>
                  <div className="swap-off">NO</div>
                </label>
              </div>
              <h3 className="font-bold text-2xl flex justify-center pt-4">
                Options - split by semi-colon(;):
              </h3>
              <div className="flex justify-center pt-4">
                <input
                  type="text"
                  id="options"
                  className="input w-full max-w-xs input-bordered "
                  value={newPollOptions}
                  onChange={(e) => setNewPollOptions(e.target.value)}
                />
              </div>

              <div className="modal-action flex justify-center">
                <label
                  htmlFor="my-modal"
                  className="btn btn-success"
                  onClick={onCreatePollClick}
                >
                  create
                </label>
                <label htmlFor="my-modal" className="btn btn-error">
                  cancel
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="font-bold text-3xl">㊑ Polls for {topicName}</div>
        <div className="flex text-sm font-semibold py-4 px-4 border border-black rounded-xl p-2 opacity-80">
          <div>Sort by: </div>
          <label className="swap swap-rotate px-1">
            <input
              type="checkbox"
              onChange={(e) =>
                setSortOrder(e.target.checked ? "popularity" : "newest")
              }
            />
            <div className="swap-on">Popularity</div>
            <div className="swap-off">Newest</div>
          </label>
        </div>
      </div>
      <div>
        <table className="table w-full opacity-80">
          <thead>
            <tr className="text-center">
              <th className="text-2xl w-1/3">Polls</th>
              <th className="text-2xl w-1/3">Descriptions</th>
              <th className="w-1/3"></th>
            </tr>
          </thead>
          <tbody>
            {polls.map((poll) => (
              <tr key={poll.id} className="hover text-xl ">
                <th className="text-start pl-20">
                  <Link to={`/poll/${poll.id}`}>{poll.title}</Link>
                </th>
                <td className="pl-20">
                  {poll.description
                    ? poll.description
                    : "No description available"}
                </td>
                <td className="dropdown dropdown-left w-full text-center">
                  <label tabIndex={0} className="btn m-1">
                    More Info
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box "
                  >
                    <li>㊟</li>
                    <li>Created By: {poll.created_by_user}</li>
                    <li>
                      Created At:{" "}
                      {new Date(poll.created_at).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </li>
                    <li>Popularity: {poll.votes}</li>
                    <li>Open: {poll.is_active ? "Yes" : "No"}</li>
                    <li>
                      Allow Multiple: {poll.allow_multiple ? "Yes" : "No"}
                    </li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        {polls.length === 0 ? <p>There is no poll now, create one</p> : null}
      </div>
    </div>
  );
};

export default Polls;
