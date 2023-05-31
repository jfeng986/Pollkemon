import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Topic } from "../db/entities/Topic.js";
import { ICreateTopicsBody } from "../types.js";

export function TopicRoutesInit(app: FastifyInstance) {
  // CRUD
  // C
  app.post<{ Body: ICreateTopicsBody }>("/topics", async (req, reply) => {
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
  });

  //R
  app.search("/topics", async (req, reply) => {
    const { topic_id } = req.body;
    console.log(req.body);
    try {
      const theTopic = await req.em.findOne(Topic, { topic_id });
      console.log(theTopic);
      reply.send(theTopic);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });

  // U
  app.put<{ Body: ICreateTopicsBody }>("/topics", async (req, reply) => {
    const { topic_id, topic_name } = req.body;
    const topicToChange = await req.em.findOne(Topic, { id: topic_id });
    topicToChange.topic_name = topic_name;
    await req.em.flush();
    console.log(topicToChange);
    reply.send(topicToChange);
  });

  // D
  app.delete<{ Body: { topic_id } }>("/topics", async (req, reply) => {
    const { topic_id } = req.body;
    try {
      const theTopic = await req.em.findOne(Topic, { id: topic_id });
      await req.em.remove(theTopic).flush();
      console.log(theTopic);
      reply.send(theTopic);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });

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
