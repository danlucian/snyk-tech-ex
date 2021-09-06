import Fastify, { FastifyInstance } from "fastify";
import corsPlugin from "fastify-cors";
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

server.register(corsPlugin);
server.route(dependenciesRoute);

export default server;