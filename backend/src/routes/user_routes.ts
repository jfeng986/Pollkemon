import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { User } from "../db/entities/User.js";
import { ICreateUsersBody } from "../types.js";
import { Poll } from "../db/entities/Poll.js";
import { PollOption } from "../db/entities/PollOption.js";

export function UserRoutesInit(app: FastifyInstance) {
  app.get("/hello", async (request: FastifyRequest, reply: FastifyReply) => {
    return "hello";
  });

  app.get("/dbTest", async (request: FastifyRequest, reply: FastifyReply) => {
    return request.em.find(User, {});
  });

  // CRUD
  // create a new user
  app.post<{ Body: ICreateUsersBody }>("/users", async (req, reply) => {
    const { username, email } = req.body;
    try {
      const theUser = await req.em.findOne(User, { email });
      if (theUser) {
        return reply
          .status(200)
          .send({ message: "User exists(login)", theUser });
      }
      const newUser = await req.em.create(User, {
        username,
        email,
        voted_polls: [],
      });
      await req.em.flush();
      console.log("Created new user:", newUser);
      return reply.status(200).send({ message: "Created new user", newUser });
    } catch (err) {
      console.log("Failed to create or find user", err.message);
      return reply.status(500).send({ message: err.message });
    }
  });

  //search for a user
  app.post<{ Body: { email } }>("/users/search", async (req, reply) => {
    const { email } = req.body;
    console.log(req.body);
    try {
      const theUser = await req.em.findOne(User, { email });
      console.log(theUser);
      reply.send(theUser);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });

  //update a user
  app.put<{ Body: ICreateUsersBody }>("/users", async (req, reply) => {
    const { username, email, password } = req.body;
    const userToChange = await req.em.findOne(User, { email });
    userToChange.username = username;
    await req.em.flush();
    console.log(userToChange);
    reply.send(userToChange);
  });

  //delete a user
  app.delete<{ Body: { email } }>("/users", async (req, reply) => {
    const { email } = req.body;
    try {
      const theUser = await req.em.findOne(User, { email });
      await req.em.remove(theUser).flush();
      console.log(theUser);
      reply.send(theUser);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });

  //user vote on a poll
  app.post<{ Body: { user_id; poll_id; poll_option_id } }>(
    "/user/vote",
    async (req, reply) => {
      const { user_id, poll_id, poll_option_id } = req.body;
      const theUser = await req.em.findOne(User, { id: user_id });
      const thePoll = await req.em.findOne(Poll, { id: poll_id });
      const thePollOption = await req.em.findOne(PollOption, {
        id: poll_option_id,
      });
      theUser.voted_polls.push(poll_option_id);
      thePoll.total_voted += 1;
      thePollOption.users.add(theUser);
      await req.em.flush();
      console.log(theUser);
      reply.send(theUser);
    }
  );
}
