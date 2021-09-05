export const port = process.env.PORT || 8085;
export const esHost =
  process.env.ELASTICSEARCH_HOSTS || "http://localhost:9200";
export const loggingLevel = process.env.LOGGING_LEVEL || "info";
export const npmRegistry =
  process.env.NPM_REGISTRY || "https://registry.npmjs.org";
