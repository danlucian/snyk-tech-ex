import Fastify, { FastifyInstance } from "fastify";
import corsPlugin from "fastify-cors";
import { loggingStreams, loggingSerializers } from "./config/logging";
import { searchRoute } from "./routes/searchRoute";
import { loggingLevel } from "./config/environment";

const server: FastifyInstance = Fastify({
  logger: {
    level: loggingLevel,
    stream: loggingStreams,
    serializers: loggingSerializers,
  },
});

server.register(corsPlugin);
server.route(searchRoute);

export default server;
