import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

// Define the type for the topic
type Topic = {
  id: number;
  created_at: string;
  updated_at: string;
  topic_name: string;
};

const Topics = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const location = useLocation();

  useEffect(() => {
    const getTopics = async () => {
      try {
        const response = await axios.get("http://localhost:8081/topics");
        setTopics(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getTopics();
  }, [location]);

  const getRandomColorClass = () => {
    const colors = [
      "bg-orange-500",
      "bg-pink-500",
      "bg-teal-500",
      "bg-red-500",
      "bg-fuchsia-500",
      "bg-rose-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-violet-500",
      "bg-indigo-500",
      "bg-sky-500",
      "bg-gray-500",
      "bg-cyan-500",
      "bg-lime-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-lightBlue-500",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const handleTopicClick = () => {
    if (!isAuthenticated || !user) {
      console.log("User is not authenticated");
      loginWithRedirect();
    } else {
      console.log("User is authenticated");
    }
  };

  const onCreateTopicClick = async () => {
    if (newTopic.trim() === "") {
      alert("Topic name cannot be empty");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8081/topics", {
        topic_name: newTopic,
      });
      console.log(response.data);
      setTopics([...topics, response.data]);
      setNewTopic("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="m-4">
      {isAuthenticated && user && (
        <div className="flex justify-center">
          <label htmlFor="my-modal" className="btn btn-outline">
            Create Topic
          </label>
          <input type="checkbox" id="my-modal" className="modal-toggle " />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-2xl flex justify-center">
                Topic Name:
              </h3>
              <div className="flex justify-center">
                <input
                  type="text"
                  placeholder="Type here"
                  className="input w-full max-w-xs "
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                />
              </div>

              <div className="modal-action flex justify-center">
                <label
                  htmlFor="my-modal"
                  className="btn btn-success"
                  onClick={onCreateTopicClick}
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
      )}
      <div className="flex justify-center pt-8">
        <div className="flex flex-wrap max-w-screen-md">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              className={`p-4 ${index % 2 !== 0 ? "pl-10" : ""}`}
            >
              <button className={`btn ${getRandomColorClass()} `}>
                <Link to={`/topic/${topic.id}`} onClick={handleTopicClick}>
                  {topic.topic_name}
                </Link>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topics;
