import { FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";
import httpClient from "../config/httpClient";
import { AxiosError } from "axios";
import { genericError } from "../models/ApiError";

export const onSearch: RouteHandlerMethod = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { name } = request.query as { name: string };
    const response = await httpClient.get(`/-/v1/search?text=${name}`);

    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET");
    
    reply.code(200).send(response.data.objects);
  } catch (error) {
    const err = error as AxiosError;
    if (err.response) {
      request.log.error(err.response.status);
      request.log.error(err.response.data);
    }

    reply
      .code(500)
      .send(
        genericError(
          "An error occurred while trying to fetch data from the NPM Registry"
        )
      );
  }
};
