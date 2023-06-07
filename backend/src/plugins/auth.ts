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
    domain: "dev-z3zlzuy1iirtsvpc.us.auth0.com",
    secret: "fEG_YJWzZp5k-2XqTFLv5yEydd3tIsYwLsWYuoQqsYtLD_HEq6DHtycBWENT0-Ex",
    audience: "https://dev-z3zlzuy1iirtsvpc.us.auth0.com/api/v2/",
  });

  app.decorate(
    "auth",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        console.log("authenticating");
        await request.jwtVerify();
        console.log("authenticated");
      } catch (err) {
        reply.send(err);
      }
    }
  );
});
