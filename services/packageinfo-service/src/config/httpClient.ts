import * as rax from "retry-axios";
import axios from "axios";
import pino from "pino";
import { npmRegistry } from "./environment";
import { loggingStreams } from "./logging";

export const registryClient = axios.create({
  baseURL: npmRegistry,
});

const logger = pino({ name: "registryClient" }, loggingStreams);

// Retry configuration
registryClient.defaults.raxConfig = {
  retry: 3,
  noResponseRetries: 2,
  retryDelay: 100,
  httpMethodsToRetry: ["GET"],
  statusCodesToRetry: [
    [429, 429],
    [500, 599],
  ],
  instance: registryClient,
  backoffType: "exponential",
  onRetryAttempt: (err) => {
    const cfg = rax.getConfig(err);
    logger.info(`Retry attempt #${cfg?.currentRetryAttempt}`);
  },
};
rax.attach(registryClient);

// Interceptors for logging
registryClient.interceptors.request.use((config) => {
  logger.info(`🛫 Firing request to: ${config.url}`);
  return config;
});
registryClient.interceptors.response.use((response) => {
  logger.info(`🛬 Receiving response with status code : ${response.status}`);
  return response;
});
