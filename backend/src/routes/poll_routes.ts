import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Poll } from "../db/entities/Poll.js";
import { ICreatePollsBody } from "../types.js";
import { PollOption } from "../db/entities/PollOption.js";
import { ICreatePollOptionsBody } from "../types.js";

export function PollRoutesInit(app: FastifyInstance) {
  // CRUD

  // create a poll with options
  app.post<{ Body: ICreatePollsBody }>("/polls", async (req, reply) => {
    const {
      title,
      topic,
      description,
      created_by,
      is_permanent,
      duration,
      allow_multiple,
      options,
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

      for (const option of options) {
        await req.em.create(PollOption, {
          option_name: option,
          Poll: newPoll,
        });
      }

      await req.em.flush();
      console.log("Created new poll:", newPoll);
      return reply.send(newPoll);
    } catch (err) {
      console.log("Failed to create new poll", err.message);
      return reply.status(500).send({ message: err.message });
    }
  });

  //search a poll, return info with options
  app.search("/polls", async (req, reply) => {
    const { id } = req.body;
    try {
      const thePoll = await req.em.findOne(Poll, { id });
      const theOptions = await req.em.find(PollOption, { poll_id: thePoll.id });
      const response = {
        poll: thePoll,
        options: theOptions,
      };
      console.log(response);
      reply.send(response);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });

  // udpate a poll
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

  // udpate a poll option
  app.put<{ Body: ICreatePollOptionsBody }>(
    "/poll/option",
    async (req, reply) => {
      const { id, option_name } = req.body;
      const optionToChange = await req.em.findOne(PollOption, { id });
      optionToChange.option_name = option_name;
      await req.em.flush();
      console.log(optionToChange);
      reply.send(optionToChange);
    }
  );

  /*
  // delete a poll(should delete all options as well)
  app.delete<{ Body: ICreatePollOptionsBody }>("/polls", async (req, reply) => {
    const { id } = req.body;
    try {
      const thePoll = await req.em.findOne(Poll, { id });
      const theOptions = await req.em.find(PollOption, { Poll: thePoll.id });

      await req.em.remove(thePoll).remove(theOptions).flush();
      console.log(thePoll);
      reply.send(thePoll);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });
  */

  // delete a poll(should delete all options as well)
  app.delete<{ Body: { id } }>("/polls", async (req, reply) => {
    const { id } = req.body;
    try {
      const thePoll = await req.em.findOne(Poll, { id });
      const theOptions = await req.em.find(PollOption, { Poll: thePoll.id });
      await req.em.remove(thePoll).remove(theOptions).flush();
      console.log(thePoll);
      reply.send(thePoll);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });

  // delete a poll option
  app.delete<{ Body: { id } }>("/poll/option", async (req, reply) => {
    const { id } = req.body;
    try {
      const theOptions = await req.em.find(PollOption, { id: id });
      await req.em.remove(theOptions).flush();
      console.log(theOptions);
      reply.send(theOptions);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });
}