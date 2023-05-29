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
  app.post<{ Body: { poll_id: number } }>("/poll", async (req, reply) => {
    const { poll_id } = req.body;
    try {
      const theOptions = await req.em.find(PollOption, { Poll: poll_id });
      const response = {
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
      poll_id,
      title,
      description,
      is_permanent,
      duration,
      allow_multiple,
      is_active,
    } = req.body;
    const pollToChange = await req.em.findOne(Poll, { id: poll_id });
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
      const { poll_option_id, option_name } = req.body;
      const optionToChange = await req.em.findOne(PollOption, {
        id: poll_option_id,
      });
      optionToChange.option_name = option_name;
      await req.em.flush();
      console.log(optionToChange);
      reply.send(optionToChange);
    }
  );

  // delete a poll(should delete all options as well)
  app.delete<{ Body: { poll_id } }>("/polls", async (req, reply) => {
    const { poll_id } = req.body;
    try {
      const thePoll = await req.em.findOne(Poll, { id: poll_id });
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
  app.delete<{ Body: { poll_option_id } }>(
    "/poll/option",
    async (req, reply) => {
      const { poll_option_id } = req.body;
      try {
        const theOptions = await req.em.find(PollOption, {
          id: poll_option_id,
        });
        await req.em.remove(theOptions).flush();
        console.log(theOptions);
        reply.send(theOptions);
      } catch (err) {
        console.error(err);
        reply.status(500).send(err);
      }
    }
  );

  // get all polls for a topic
  app.post<{ Body: { topic_id: number } }>(
    "/topic/polls",
    async (req, reply) => {
      const { topic_id } = req.body;
      try {
        const thePolls = await req.em.find(Poll, { topic: topic_id });
        console.log(thePolls);
        //get number of voted user for each poll
        reply.send(thePolls);
      } catch (err) {
        console.error(err);
        reply.status(500).send(err);
      }
    }
  );
}
