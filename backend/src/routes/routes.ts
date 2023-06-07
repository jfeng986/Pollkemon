import { FastifyInstance } from "fastify";
import { UserRoutesInit } from "./user_routes.js";
import { TopicRoutesInit } from "./topic_routes.js";
import { PollRoutesInit } from "./poll_routes.js";

async function Routes(app: FastifyInstance, _options = {}) {
  if (!app) {
    throw new Error("Fastify instance has no value during routes construction");
  }
  UserRoutesInit(app);
  TopicRoutesInit(app);
  PollRoutesInit(app);
}

export default Routes;
