import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { httpClient } from "../services/HttpClient";
import { Link, useLocation } from "react-router-dom";
import { Topic } from "../Types";
import { RandomColorBg } from "../assets/Color";

const Topics = () => {
  const { user, isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
    useAuth0();
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "popularity">("newest");
  const location = useLocation();

  useEffect(() => {
    const getTopics = async () => {
      //const accessToken = await getAccessTokenSilently();
      try {
        const response = await httpClient.get("/topics", {});
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
    const accessToken = await getAccessTokenSilently();
    console.log("accessToken", accessToken);
    try {
      const response = await httpClient.post(
        "/topics",
        {
          topic_name: newTopic,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTopics([...topics, response.data]);
      setNewTopic("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="m-4">
      {isAuthenticated && user && (
        <div className="flex justify-between p-4 text-center items-center ">
          <label htmlFor="my-modal" className="btn btn-outline opacity-80">
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
          <div className="flex text-sm font-semibold py-4 px-4 border border-black rounded-xl p-2 opacity-80">
            <div className="">Sort by: </div>
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
                  className={`btn ${RandomColorBg()} `}
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
