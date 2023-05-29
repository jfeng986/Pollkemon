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
};

const Polls = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  const { topicId } = useParams<RouteParams>();
  const [polls, setPolls] = useState<Poll[]>([]);

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

  if (!isAuthenticated || !user) {
    loginWithRedirect();
    return null;
  }

  return (
    <div>
      <h2>Polls for Topic</h2>
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
    </div>
  );
};

export default Polls;
