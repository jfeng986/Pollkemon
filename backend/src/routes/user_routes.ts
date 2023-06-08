import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { User } from "../db/entities/User.js";
import { ICreateUsersBody } from "../types.js";

export function UserRoutesInit(app: FastifyInstance) {
  app.get("/hello", async (request: FastifyRequest, reply: FastifyReply) => {
    return "hello";
  });

  app.get("/dbTest", async (request: FastifyRequest, reply: FastifyReply) => {
    return request.em.find(User, {});
  });

  //create a new user
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

  //search for a user by email
  app.post<{ Body: { email } }>("/users/search", async (req, reply) => {
    const { email } = req.body;
    try {
      const theUser = await req.em.findOne(User, { email });
      reply.send(theUser);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });

  //search for a user by id
  app.post<{ Body: { id } }>("/users/searchid", async (req, reply) => {
    const { id } = req.body;
    try {
      const theUser = await req.em.findOne(User, { id });
      reply.send(theUser);
    } catch (err) {
      console.error(err);
      reply.status(500).send(err);
    }
  });
}
