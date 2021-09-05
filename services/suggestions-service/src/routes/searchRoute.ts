import { RouteOptions } from "fastify";
import { onSearch } from "../handlers/searchHandler";

export const searchSchema = {
  querystring: {
    type: "object",
    properties: {
      name: {
        type: "string",
      },
    },
    required: ["name"],
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          package: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              scope: {
                type: "string",
              },
              version: {
                type: "string",
              },
              description: {
                type: "string",
              },
              keywords: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              date: {
                type: "string",
                format: "date-time",
              },
              links: {
                type: "object",
                properties: {
                  npm: {
                    type: "string",
                  },
                  homepage: {
                    type: "string",
                  },
                  repository: {
                    type: "string",
                  },
                  bugs: {
                    type: "string",
                  },
                },
              },
              author: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                },
              },
              publisher: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                  },
                  email: {
                    type: "string",
                  },
                },
              },
              maintainers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                    },
                    email: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          flags: {
            type: "object",
            properties: {
              unstable: {
                type: "boolean",
              },
            },
          },
          score: {
            type: "object",
            properties: {
              final: {
                type: "number",
              },
              detail: {
                type: "object",
                properties: {
                  quality: {
                    type: "number",
                  },
                  popularity: {
                    type: "number",
                  },
                  maintenance: {
                    type: "number",
                  },
                },
              },
            },
          },
          searchScore: {
            type: "number",
          },
        },
      },
    },
    500: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
        },
        error: {
          type: "string",
        },
        message: {
          type: "string",
        },
      },
    },
    400: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
        },
        error: {
          type: "string",
        },
        message: {
          type: "string",
        },
      },
    },
  },
};

export const searchRoutes: Array<RouteOptions> = [
  {
    method: "GET",
    url: "/search/suggestions",
    handler: onSearch,
    schema: searchSchema,
  },
];
