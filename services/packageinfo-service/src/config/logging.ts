import { FastifyReply, FastifyRequest } from "fastify";
import PinoMultiStream from "pino-multi-stream";
import { esHost } from "./environment";

const toElastic = require("pino-elasticsearch")({
  index: "packageinfo-service-index",
  consistency: "one",
  node: esHost,
  "es-version": 7,
  "flush-bytes": 1000,
});

export const loggingStreams = PinoMultiStream.multistream([
  { stream: process.stdout },
  { stream: toElastic },
]);

export const loggingSerializers = {
  res(reply: FastifyReply) {
    return {
      statusCode: reply.statusCode,
    };
  },
  req(request: FastifyRequest) {
    return {
      method: request.method,
      url: request.url,
      path: request.routerPath,
      parameters: request.params,
      headers: request.headers,
    };
  },
};
