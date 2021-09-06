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
import { noDependenciesFound } from "../models/api/ApiError";
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
  const { pckg } = request.params as { pckg: string };
  const { depth } = request.query as { depth: string };

  const head: TreeNode = new TreeNode();
  await fetchDependencies(
    head,
    pckg,
    LATEST,
    depth ? +depth : +depthLevel,
    request.log
  );

  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Methods", "GET");

  if (head.value) {
    reply.status(200).send(head);
  } else {
    reply.status(404).send(noDependenciesFound());
  }
};

const fetchDependencies = async (
  node: TreeNode,
  pckg: string,
  vers: string,
  depth: number,
  logger: FastifyLoggerInstance
) => {
  if (depth >= 0) {
    try {
      const { name, version, dependencies } = (await cachedOrRemote(
        pckg,
        vers
      )) as RegistryResponse;

      node.value = {
        name: name,
        version: version,
      };

      if (depth == 0) {
        for (const [index, [key, value]] of entriesOfEntries(dependencies)) {
          node.children[+index] = new TreeNode({
            name: key,
            version: removeSymbolsFrom(value),
          });
        }
      } else if (keysNo(dependencies) !== 0) {
        for (const [index, [key, value]] of entriesOfEntries(dependencies)) {
          node.children[+index] = new TreeNode();

          await fetchDependencies(
            node.children[+index],
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
};

const cachedOrRemote = async (pckg: string, vers: string) => {
  const cached = cache.get(computeKey(pckg, vers));
  if (cached) {
    return JSON.parse(cached);
  } else {
    const response = await registryClient.get(`/${pckg}/${vers}`);
    cache.set(computeKey(pckg, vers), JSON.stringify(response.data));
    return response.data;
  }
};
