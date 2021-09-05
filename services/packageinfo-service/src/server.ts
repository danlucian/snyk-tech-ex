import Fastify, { FastifyInstance } from "fastify";
import { loggingStreams, loggingSerializers } from "./config/logging";
import { loggingLevel } from "./config/environment";

const server: FastifyInstance = Fastify({
  logger: {
    level: loggingLevel,
    stream: loggingStreams,
    serializers: loggingSerializers,
  },
});

export default server;
