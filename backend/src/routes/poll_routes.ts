import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Poll } from "../db/entities/Poll.js";
import { ICreatePollsBody } from "../types.js";
import { PollOption } from "../db/entities/PollOption.js";
import { ICreatePollOptionsBody } from "../types.js";
import { User } from "../db/entities/User.js";
import { Topic } from "../db/entities/Topic.js";

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
    //search userID by email
    try {
      const created_by_email = String(created_by);
      const theUser = await req.em.findOne(User, { email: created_by_email });
      if (!theUser) {
        console.log("User does not exist");
        return reply.status(200).send({ message: "User does not exist" });
      }
      const created_by_id = Number(theUser.id);
      const newPoll = await req.em.create(Poll, {
        title,
        topic,
        description,
        created_by: created_by_id,
        is_permanent,
        duration,
        allow_multiple,
        is_active: true,
        votes: 0,
      });
      console.log(newPoll);
      console.log(options);
      for (const option of options) {
        await req.em.create(PollOption, {
          option_name: option,
          Poll: newPoll,
          votes: 0,
        });
      }

      await req.em.flush();
      console.log("Created new poll:", newPoll);
      return reply.send(newPoll);
    } catch (err) {
      console.log("Failed to find user", err.message);
      return reply.status(500).send({ message: err.message });
    }
  });

  //search a poll, return info with options
  app.post<{ Body: { poll_id: number } }>("/poll", async (req, reply) => {
    const { poll_id } = req.body;
    try {
      const thePoll = await req.em.findOne(Poll, { id: poll_id });
      const theOptions = await req.em.find(PollOption, { Poll: poll_id });
      const response = {
        options: theOptions,
        poll: thePoll,
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

  //vote on a poll
  app.post<{ Body: { poll_id: number; option_id: number } }>(
    "/poll/vote",
    async (req, reply) => {
      const { poll_id, option_id } = req.body;

      try {
        const theOption = await req.em.findOne(PollOption, { id: option_id });
        theOption.votes += 1;
        const thePoll = await req.em.findOne(Poll, { id: poll_id });
        thePoll.votes += 1;

        //get topic id
        const theTopic = await req.em.findOne(Topic, { id: thePoll.topic.id });
        theTopic.votes += 1;

        await req.em.flush();
        console.log(theOption);
        reply.send(theOption);
      } catch (err) {
        console.error(err);
        reply.status(500).send(err);
      }
    }
  );

  //get all polls created by users
  app.post<{ Body: { polls: Poll[] } }>(
    "/topic/createdbyuser",
    async (req, reply) => {
      const { polls } = req.body;
      //console.log(polls);
      try {
        for (const poll of polls) {
          const theUser = await req.em.findOne(User, {
            id: Number(poll.created_by),
          });
          poll.created_by = theUser;
        }
        let createdByList = [];
        for (const poll of polls) {
          createdByList.push(poll.created_by.username);
        }
        console.log(createdByList);
        reply.send(createdByList);
      } catch (err) {
        console.error(err);
        reply.send(err);
      }
    }
  );
}
