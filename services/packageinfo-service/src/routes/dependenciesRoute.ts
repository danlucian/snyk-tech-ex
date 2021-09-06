import { RouteOptions } from "fastify";
import { computeDependencies } from "../handlers/dependenciesHandler";

export const dependenciesSchema = {
  querystring: {
    type: "object",
    properties: {
      depth: {
        type: "number",
        minimum: 0,
      },
      pckg: { 
        type: "string", 
        minLength: 1, 
        maxLength: 214
      }
    },
    required: [ "pckg" ]
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
            children: {
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
        children: {
          $ref: "#/definitions/tree",
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
  },
};
export const dependenciesRoute: RouteOptions = {
    method: "GET",
    url: "/dependencies",
    handler: computeDependencies,
    schema: dependenciesSchema
};
