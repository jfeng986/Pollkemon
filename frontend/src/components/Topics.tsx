import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

type Topic = {
  id: number;
  created_at: string;
  updated_at: string;
  topic_name: string;
  votes: number;
};

const Topics = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "popularity">("newest");
  const location = useLocation();

  useEffect(() => {
    const getTopics = async () => {
      try {
        const response = await axios.get("http://localhost:8081/topics");
        let sortedTopics;
        if (sortOrder === "newest") {
          sortedTopics = response.data.sort((a: Topic, b: Topic) => {
            return (
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
            );
          });
        } else {
          sortedTopics = response.data.sort(
            (a: Topic, b: Topic) => b.votes - a.votes
          );
        }
        setTopics(sortedTopics);
      } catch (error) {
        console.error(error);
      }
    };
    getTopics();
  }, [location, sortOrder]);

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
        <div className="flex justify-between p-4 text-center items-center opacity-80">
          <label htmlFor="my-modal" className="btn btn-outline">
            Create Topic
          </label>
          <input type="checkbox" id="my-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-2xl flex justify-center">
                Topic Name:
              </h3>
              <div className="flex justify-center px-2 pt-2">
                <input
                  type="text"
                  placeholder="Type here"
                  className="input w-full max-w-xs input-bordered "
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
          <div className="flex text-sm font-semibold py-4 px-4 border border-black rounded-xl p-2">
            <div className="">Sorted by: </div>
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
      )}
      <div className="flex justify-center pt-8">
        <div className="flex flex-wrap max-w-screen-md">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              className={`p-4 ${index % 2 !== 0 ? "pl-10" : ""}`}
            >
              <Link to={`/topic/${topic.topic_name}/${topic.id}`}>
                <button
                  className={`btn ${getRandomColorClass()} `}
                  onClick={handleTopicClick}
                >
                  {topic.topic_name}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topics;
