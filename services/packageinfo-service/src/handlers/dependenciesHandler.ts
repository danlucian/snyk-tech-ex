import {
  FastifyReply,
  FastifyRequest,
  RouteHandlerMethod,
  FastifyLoggerInstance,
} from "fastify";
import { AxiosError } from "axios";
import { registryClient } from "../config/httpClient";
import { depthLevel } from "../config/environment";
import TreeNode from "../models/domain/Tree";
import RegistryResponse from "../models/api/RegistryResponse";
import { genericError } from "../models/api/ApiError";
import {
  keysNo,
  removeSymbolsFrom,
  entriesOfEntries,
  computeKey,
} from "../util/util";
import { LATEST } from "../util/invariants";
import cache from "../config/cache";

export const computeDependencies: RouteHandlerMethod = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { pckg, depth } = request.query as { pckg: string, depth: number };
  const head: TreeNode = await fetchDependencies(
    pckg,
    LATEST,
    depth != undefined ? depth : +depthLevel,
    request.log
  );

  if (head.value?.version != LATEST) {
    reply.status(200).send(head);
  } else {
    reply.status(500).send(genericError("Unable to fetch the dependencies!"));
  }
};

const fetchDependencies = async (
  pckg: string,
  vers: string,
  depth: number,
  logger: FastifyLoggerInstance
) => {
  const node: TreeNode = new TreeNode({
    name: pckg,
    version: vers,
  });

  if (depth >= 0) {
    try {
      const { version , dependencies } = (await cachedOrRemote(
        pckg,
        vers
      )) as RegistryResponse;

      if (node.value?.version == LATEST) {
        node.value.version = version;
      }

      if (depth == 0 && keysNo(dependencies) !== 0) {
        for (const [index, [key, value]] of entriesOfEntries(dependencies)) {
          node.children[+index] = new TreeNode({
            name: key,
            version: removeSymbolsFrom(value),
          });
        }
      } else if (keysNo(dependencies) !== 0) {
        for (const [index, [key, value]] of entriesOfEntries(dependencies)) {
          node.children[+index] = await fetchDependencies(
            key,
            removeSymbolsFrom(value),
            depth - 1,
            logger
          );
        }   
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        logger.error(
          `💥 Error while fetching package info [${pckg}/${vers}]: response code: ${err.response.status} with reason: ${err.response.data}`
        );
      }
    }
  }

  return node;
};

const cachedOrRemote = async (pckg: string, vers: string) => {
  if (vers === LATEST) {
    const response = await registryClient.get(`/${pckg}/${vers}`);
    cache.set(computeKey(pckg, vers), JSON.stringify(response.data));
    return response.data;
  }

  const cached = cache.get(computeKey(pckg, vers));
  if (cached) {
    return JSON.parse(cached);
  } else {
    const response = await registryClient.get(`/${pckg}/${vers}`);
    cache.set(computeKey(pckg, vers), JSON.stringify(response.data));
    return response.data;
  }
};
