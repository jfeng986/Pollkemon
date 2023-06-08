import dotenv from "dotenv";
dotenv.config();
import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { VerifyPayloadType } from "@fastify/jwt";
import fp from "fastify-plugin";
import fastifyAuth0Verify from "fastify-auth0-verify";

declare module "fastify" {
  interface FastifyRequest {
    jwtVerify(): Promise<VerifyPayloadType>;
  }
  interface FastifyInstance {
    auth(): void;
  }
}

export const AuthPlugin = fp(async function (
  app: FastifyInstance,
  opts: FastifyPluginOptions
) {
  app.register(fastifyAuth0Verify, {
    secret: process.env.AUTH0_SECRET,
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
  });

  app.decorate(
    "auth",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        console.log("authenticating jwt");
        await request.jwtVerify();
        console.log("jwt verified");
      } catch (err) {
        reply.send(err);
      }
    }
  );
});
