import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the type for the topic
type Topic = {
  id: number;
  created_at: string;
  updated_at: string;
  topic_name: string;
};

const Topics = () => {
  const { user, isAuthenticated } = useAuth0();

  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const getTopics = async () => {
      try {
        const response = await axios.get("http://localhost:8081/topics");
        setTopics(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getTopics();
  }, []);

  const getRandomColorClass = () => {
    const colors = [
      "btn-active",
      "btn-primary",
      "btn-secondary",
      "btn-info",
      "btn-success",
      "btn-warning",
      "btn-error",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return isAuthenticated && user ? (
    <div className="m-4">
      <div className="flex justify-center pt-8">
        <div className="flex flex-wrap max-w-screen-md">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              className={`p-4 ${index % 2 !== 0 ? "pl-10" : ""}`}
            >
              <button className={`btn ${getRandomColorClass()} `}>
                {topic.topic_name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default Topics;
