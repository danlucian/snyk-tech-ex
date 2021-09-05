import Fastify, { FastifyInstance } from "fastify";
import { loggingStreams, loggingSerializers } from "./config/logging";
import { searchRoutes } from "./routes/searchRoute";

const server: FastifyInstance = Fastify({
  logger: {
    level: "info",
    stream: loggingStreams,
    serializers: loggingSerializers,
  },
});

searchRoutes.forEach((route) => server.route(route));

export default server;
