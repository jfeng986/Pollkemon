import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Poll } from "../db/entities/Poll.js";
import { ICreatePollsBody } from "../types.js";

export function PollRoutesInit(app: FastifyInstance) {
  // CRUD
  // C
  app.post<{ Body: ICreatePollsBody }>("/polls", async (req, reply) => {
    const {
      title,
      topic,
      description,
      created_by,
      is_permanent,
      duration,
      allow_multiple,
    } = req.body;
    try {
      const newPoll = await req.em.create(Poll, {
        title,
        topic,
        description,
        created_by,
        is_permanent,
        duration,
        allow_multiple,
        is_active: true,
      });
      await req.em.flush();
      console.log("Created new poll:", newPoll);
      return reply.send(newPoll);
    } catch (err) {
      console.log("Failed to create new poll", err.message);
      return reply.status(500).send({ message: err.message });
    }
  });

  //R
  app.search("/polls", async (req, reply) => {
    const { id } = req.body;
    console.log(req.body);
    try {
      const thePoll = await req.em.findOne(Poll, { id });
      console.log(thePoll);
      reply.send(thePoll);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });

  // U
  app.put<{ Body: ICreatePollsBody }>("/polls", async (req, reply) => {
    const {
      id,
      title,
      description,
      is_permanent,
      duration,
      allow_multiple,
      is_active,
    } = req.body;
    const pollToChange = await req.em.findOne(Poll, { id });
    pollToChange.title = title;
    pollToChange.description = description;
    pollToChange.is_permanent = is_permanent;
    pollToChange.duration = duration;
    pollToChange.allow_multiple = allow_multiple;
    pollToChange.is_active = is_active;

    await req.em.flush();
    console.log(pollToChange);
    reply.send(pollToChange);
  });

  // D
  app.delete<{ Body: { id } }>("/polls", async (req, reply) => {
    const { id } = req.body;
    try {
      const thePoll = await req.em.findOne(Poll, { id });
      await req.em.remove(thePoll).flush();
      console.log(thePoll);
      reply.send(thePoll);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });
}
