export const removeSymbolsFrom = (version: string) =>
  version.replace(/[^0-9.]/g, "");
export const keysNo = (obj?: object) => {
  if (!!obj) {
    return Object.keys(obj).length;
  } else {
    return 0;
  }
};
export const entriesOfEntries = (obj: object) =>
  Object.entries(Object.entries(obj));
export const computeKey = (a: string, b: string) => a + "-" + b;
