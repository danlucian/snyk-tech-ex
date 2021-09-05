import * as rax from "retry-axios";
import axios from "axios";
import pino from "pino";
import { npmRegistry } from "./environment";
import { loggingStreams } from "./logging";

const logger = pino({ name: "httpClient" }, loggingStreams);
const httpClient = axios.create({
  baseURL: npmRegistry,
});

// Retry configuration
httpClient.defaults.raxConfig = {
  retry: 3,
  noResponseRetries: 2,
  retryDelay: 100,
  httpMethodsToRetry: ["GET"],
  statusCodesToRetry: [
    [429, 429],
    [500, 599],
  ],
  instance: httpClient,
  backoffType: "exponential",
  onRetryAttempt: (err) => {
    const cfg = rax.getConfig(err);
    logger.info(`Retry attempt #${cfg?.currentRetryAttempt}`);
  },
};
rax.attach(httpClient);

// Interceptors for logging
httpClient.interceptors.request.use((config) => {
  logger.info(`🛫 Firing request to: ${config.url}`);
  return config;
});
httpClient.interceptors.response.use((response) => {
  logger.info(`🛬 Receiving response with status code : ${response.status}`);
  return response;
});

export default httpClient;
