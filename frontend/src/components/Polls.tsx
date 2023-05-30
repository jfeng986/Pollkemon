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
        console.log(response.data);
        setPolls(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getPolls();
  }, []);

  const handlePollClick = () => {};
  const onCreatePollClick = async () => {
    if (newPollName.trim() === "") {
      alert("Poll name cannot be empty");
      return;
    } else if (newPollOptions.length === 0) {
      alert("Poll must have at least one option");
      return;
    }
    if (newPollDurationHour === 0 && newPollDurationMinute === 0) {
      setIsPermanent(true);
    } else {
      setNewPollDuration(newPollDurationHour * 60 + newPollDurationMinute);
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
      <div className="flex justify-center pt-8">
        <div className="flex flex-col max-w-screen-md">
          {polls.map((poll) => (
            <div key={poll.id}>
              <Link to={`/poll/${poll.id}`} onClick={handlePollClick}>
                {poll.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center pt-8">
        <label htmlFor="my-modal" className="btn ">
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
              <input
                type="checkbox"
                id="allow-multiple"
                checked={newPollAllowMultiple}
                onChange={(e) => setNewPollAllowMultiple(e.target.checked)}
              />
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
