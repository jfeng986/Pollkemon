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

  // CRUD
  // C
  app.post<{ Body: ICreateUsersBody }>("/users", async (req, reply) => {
    const { username, email, password } = req.body;
    try {
      const newUser = await req.em.create(User, {
        username,
        email,
        password,
        voted_polls: [],
      });
      await req.em.flush();
      console.log("Created new user:", newUser);
      return reply.send(newUser);
    } catch (err) {
      console.log("Failed to create new user", err.message);
      return reply.status(500).send({ message: err.message });
    }
  });

  //R
  app.search("/users", async (req, reply) => {
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

  // U
  app.put<{ Body: ICreateUsersBody }>("/users", async (req, reply) => {
    const { username, email, password } = req.body;
    const userToChange = await req.em.findOne(User, { email });
    userToChange.username = username;
    userToChange.password = password;
    await req.em.flush();
    console.log(userToChange);
    reply.send(userToChange);
  });

  // D
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
}
