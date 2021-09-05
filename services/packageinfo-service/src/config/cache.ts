import LRU from "lru-cache";
import { cacheSize } from "../config/environment";

export default new LRU<string, string>(+cacheSize);
