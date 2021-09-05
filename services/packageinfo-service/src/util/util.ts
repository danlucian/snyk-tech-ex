export const removeSymbolsFrom = (version: string) =>
  version.replace(/[^0-9.]/g, "");
export const keysNo = (obj: object) => obj && Object.keys(obj).length;
export const entriesOfEntries = (obj: object) =>
  Object.entries(Object.entries(obj));
export const computeKey = (a: string, b: string) => a + "-" + b;
