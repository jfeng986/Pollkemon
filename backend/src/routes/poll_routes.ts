import { FastifyInstance } from "fastify";
import { Poll } from "../db/entities/Poll.js";
import { ICreatePollsBody } from "../types.js";
import { PollOption } from "../db/entities/PollOption.js";
import { User } from "../db/entities/User.js";
import { Topic } from "../db/entities/Topic.js";

export function PollRoutesInit(app: FastifyInstance) {
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
      for (const option of options) {
        await req.em.create(PollOption, {
          option_name: option,
          Poll: newPoll,
          votes: 0,
        });
      }
      const theTopic = await req.em.findOne(Topic, { id: topic });
      theTopic.updated_at = new Date();
      await req.em.flush();

      return reply.send(newPoll);
    } catch (err) {
      console.log("Failed to find user", err.message);
      return reply.status(500).send({ message: err.message });
    }
  });

  //search a poll, return info with options
  app.post<{ Body: { poll_id: number; email: string } }>(
    "/poll",
    {
      preValidation: app.auth,
    },
    async (req, reply) => {
      const { poll_id, email } = req.body;
      try {
        const thePoll = await req.em.findOne(Poll, { id: poll_id });
        const theOptions = await req.em.find(PollOption, { Poll: poll_id });
        const theUser = await req.em.findOne(User, { email: email });
        //check poll's date and time is expired or not
        const now = new Date();
        const pollDate = new Date(thePoll.created_at);
        const pollDuration = thePoll.duration; //in minutes
        if (!thePoll.is_permanent) {
          const pollExpired = new Date(
            pollDate.getTime() + pollDuration * 60000
          );
          if (now > pollExpired) {
            thePoll.is_active = false;
            await req.em.flush();
          }
        }
        const response = {
          options: theOptions,
          poll: thePoll,
          user: theUser,
        };
        reply.send(response);
      } catch (err) {
        console.error(err);
        reply.status(500).send(err);
      }
    }
  );

  // delete a poll(should delete all options as well)
  app.delete<{ Body: { poll_id } }>("/polls", async (req, reply) => {
    const { poll_id } = req.body;
    try {
      const thePoll = await req.em.findOne(Poll, { id: poll_id });
      const theOptions = await req.em.find(PollOption, { Poll: thePoll.id });
      await req.em.remove(thePoll).remove(theOptions).flush();
      reply.send(thePoll);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });

  // delete a poll option
  app.delete<{ Body: { poll_option_id } }>(
    "/poll/option",
    {
      preValidation: app.auth,
    },
    async (req, reply) => {
      const { poll_option_id } = req.body;
      try {
        const theOptions = await req.em.find(PollOption, {
          id: poll_option_id,
        });
        await req.em.remove(theOptions).flush();
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
    {
      preValidation: app.auth,
    },
    async (req, reply) => {
      const { topic_id } = req.body;
      console.log("req.body", req.body);
      try {
        const thePolls = await req.em.find(Poll, { topic: topic_id });
        //get number of voted user for each poll
        reply.send(thePolls);
      } catch (err) {
        console.error(err);
        reply.status(500).send(err);
      }
    }
  );

  //vote on a poll
  app.post<{ Body: { poll_id: number; option_id: number; email: string } }>(
    "/poll/vote",
    {
      preValidation: app.auth,
    },
    async (req, reply) => {
      const { poll_id, option_id, email } = req.body;
      console.log("req.body", req.body);
      try {
        const theOption = await req.em.findOne(PollOption, { id: option_id });
        theOption.votes += 1;
        const thePoll = await req.em.findOne(Poll, { id: poll_id });
        thePoll.votes += 1;
        const theTopic = await req.em.findOne(Topic, { id: thePoll.topic.id });
        theTopic.votes += 1;
        const theUser = await req.em.findOne(User, {
          email: email,
        });
        theUser.voted_polls.push(poll_id);
        await req.em.flush();
        reply.send(theOption);
      } catch (err) {
        console.error(err);
        reply.status(500).send(err);
      }
    }
  );
}
