import Fastify, { FastifyInstance } from "fastify";
import { loggingStreams, loggingSerializers } from "./config/logging";
import { loggingLevel } from "./config/environment";
import { dependenciesRoute } from "./routes/dependenciesRoute";

const server: FastifyInstance = Fastify({
  logger: {
    level: loggingLevel,
    stream: loggingStreams,
    serializers: loggingSerializers,
  },
});

dependenciesRoute.forEach((route) => server.route(route));

export default server;
