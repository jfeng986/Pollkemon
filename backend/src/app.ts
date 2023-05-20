import Fastify from "fastify";
import config from "./db/mikro-orm.config.js";
import { FastifySearchHttpMethodPlugin } from "./plugins/http_search.js";
import { FastifyMikroOrmPlugin } from "./plugins/mikro.js";
import Routes from "./routes.js";

const app = Fastify();

await app.register(FastifyMikroOrmPlugin, config);
await app.register(FastifySearchHttpMethodPlugin);

await app.register(Routes);

export default app;
