import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

type RouteParams = {
  topicId: string;
};

type Poll = {
  id: number;
  title: string;
  topic: number;
  description: string;
  created_by: number;
  is_permanent: boolean;
  duration: number;
  is_active: boolean;
  allow_multiple: boolean;
  created_by_user: string;
};

const Polls = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  const { topicId } = useParams<RouteParams>();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newPollName, setNewPollName] = useState("");
  const [newPollDescription, setNewPollDescription] = useState("");
  const [newPollDurationHour, setNewPollDurationHour] = useState(0);
  const [newPollDurationMinute, setNewPollDurationMinute] = useState(0);
  const [newPollDuration, setNewPollDuration] = useState(0);
  const [isPermanent, setIsPermanent] = useState(false);
  const [newPollAllowMultiple, setNewPollAllowMultiple] = useState(false);
  const [newPollOptions, setNewPollOptions] = useState<string[]>([]);

  useEffect(() => {
    const getPolls = async () => {
      try {
        console.log("topicId", topicId);
        const response = await axios.post(`http://localhost:8081/topic/polls`, {
          topic_id: topicId,
        });
        const pollsWithUserNames = await Promise.all(
          response.data.map(async (poll: Poll) => {
            const created_by_user = await getUserName(poll.created_by);
            return { ...poll, created_by_user };
          })
        );
        setPolls(pollsWithUserNames);
      } catch (error) {
        console.error(error);
      }
    };
    getPolls();
  }, []);

  const getUserName = async (id: number) => {
    try {
      const response = await axios.post(
        `http://localhost:8081/users/searchid`,
        {
          id,
        }
      );
      return response.data.username;
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  useEffect(() => {
    if (newPollDurationHour === 0 && newPollDurationMinute === 0) {
      setIsPermanent(true);
      setNewPollDuration(-1);
    } else {
      setIsPermanent(false);
      setNewPollDuration(newPollDurationHour * 60 + newPollDurationMinute);
    }
  }, [newPollDurationHour, newPollDurationMinute]);

  const onCreatePollClick = async () => {
    if (newPollName.trim() === "") {
      alert("Poll name cannot be empty");
      return;
    } else if (newPollOptions.length === 0) {
      alert("Poll must have at least one option");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8081/polls", {
        title: newPollName,
        description: newPollDescription,
        topic: topicId,
        created_by: user?.email,
        is_permanent: isPermanent,
        duration: newPollDuration,
        is_active: true,
        allow_multiple: newPollAllowMultiple,
        options: newPollOptions,
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  if (!isAuthenticated || !user) {
    loginWithRedirect();
    return null;
  }

  return (
    <div>
      <h2>Polls for This Topic</h2>
      {topicId}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>POLL</th>
              <th>Created By</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {polls.map((poll) => (
              <tr key={poll.id} className="hover">
                <th>
                  <Link to={`/poll/${poll.id}`}>{poll.title}</Link>
                </th>
                <td>{poll.created_by_user}</td>
                <td>{poll.is_active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center pt-8">
        <label htmlFor="my-modal" className="btn btn-outline">
          Create New Poll
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
                className="input w-full max-w-xs "
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
                className="input w-full max-w-xs"
                value={newPollDescription}
                onChange={(e) => setNewPollDescription(e.target.value)}
              />
            </div>
            <h3 className="font-bold text-2xl flex justify-center pt-4">
              Duration(remain 0 if permanent):
            </h3>
            <div className="flex justify-center p-1">
              <p className="pr-2 font-bold">Hour: </p>
              <input
                type="number"
                id="duration"
                className="w-1/2"
                value={newPollDurationHour}
                onChange={(e) => setNewPollDurationHour(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-center p-1">
              <p className="pr-2 font-bold">Minute: </p>
              <input
                type="number"
                id="duration"
                className="w-1/2"
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
              Options(split by comma):
            </h3>
            <div className="flex justify-center pt-4">
              <input
                type="text"
                id="options"
                className="input w-full max-w-xs"
                value={newPollOptions}
                onChange={(e) => setNewPollOptions(e.target.value.split(","))}
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
    </div>
  );
};

export default Polls;
