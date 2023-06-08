import { FastifyInstance } from "fastify";
import { Topic } from "../db/entities/Topic.js";
import { ICreateTopicsBody } from "../types.js";

export function TopicRoutesInit(app: FastifyInstance) {
  //create a topic
  app.post<{ Body: ICreateTopicsBody }>(
    "/topics",
    {
      preValidation: app.auth,
    },
    async (req, reply) => {
      const { topic_name } = req.body;
      try {
        const newTopic = await req.em.create(Topic, {
          topic_name,
          votes: 0,
        });
        await req.em.flush();
        console.log("Created new topic:", newTopic);
        return reply.send(newTopic);
      } catch (err) {
        console.log("Failed to create new topic", err.message);
        return reply.status(500).send({ message: err.message });
      }
    }
  );

  // Get all topics
  app.get("/topics", async (req, reply) => {
    try {
      const theTopics = await req.em.find(Topic, {});
      const theTopicsArray = Array.from(theTopics);
      reply.send(theTopicsArray);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });
}
