export const port = process.env.PORT || 8086;
export const esHost =
  process.env.ELASTICSEARCH_HOSTS || "http://localhost:9200";
export const loggingLevel = process.env.LOGGING_LEVEL || "info";
export const npmRegistry =
  process.env.NPM_REGISTRY || "https://registry.npmjs.org";
export const depthLevel = process.env.DEPTH_LEVEL || 32;
export const cacheSize = process.env.CACHE_SIZE || 4096;
