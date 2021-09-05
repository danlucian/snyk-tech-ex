import Fastify, { FastifyInstance } from "fastify";
import { loggingStreams, loggingSerializers } from "./config/logging";
import { searchRoutes } from "./routes/searchRoute";
import { loggingLevel } from "./config/environment";

const server: FastifyInstance = Fastify({
  logger: {
    level: loggingLevel,
    stream: loggingStreams,
    serializers: loggingSerializers,
  },
});

searchRoutes.forEach((route) => server.route(route));

export default server;
