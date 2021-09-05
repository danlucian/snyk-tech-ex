import { RouteOptions } from "fastify";
import { computeDependencies } from "../handlers/dependenciesHandler";

export const dependenciesSchema = {
  params: {
    type: "object",
    properties: {
      depth: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      definitions: {
        value: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            version: {
              type: "string",
            },
          },
        },
        tree: {
          type: "array",
          properties: {
            value: {
              $ref: "#/definitions/value",
            },
            childs: {
              type: "array",
              items: {
                $ref: "#/definitions/tree",
              },
            },
          },
        },
      },
      properties: {
        value: {
          $ref: "#/definitions/value",
        },
        childs: {
          $ref: "#/definitions/tree",
        },
      },
    },
    404: {
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
export const dependenciesRoute: Array<RouteOptions> = [
  {
    method: "GET",
    url: "/dependencies/:pckg",
    handler: computeDependencies,
  },
];
