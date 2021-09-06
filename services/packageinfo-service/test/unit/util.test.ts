import tap from "tap";
import { removeSymbolsFrom, keysNo, entriesOfEntries, computeKey } from "../../src/util/util";

tap.test("Test the removal o symbols from string", async ({ equal }) => {
    equal(removeSymbolsFrom("^1.1.1") === "1.1.1",  true,    "the ^ symbol must be removed from string");
    equal(removeSymbolsFrom("~1.1.1") === "1.1.1",  true,    "the ~ symbol must be removed from string");
    equal(removeSymbolsFrom(">1.1.1") === "1.1.1",  true,    "the > symbol must be removed from string");
    equal(removeSymbolsFrom("<=1.1.1") === "1.1.1", true,    "the <= symbol must be removed from string");
    equal(removeSymbolsFrom("<1.1.1") === "1.1.1",  true,    "the < symbol must be removed from string");
    equal(removeSymbolsFrom("=1.1.1") === "1.1.1",  true,    "the = symbol must be removed from string");
    equal(removeSymbolsFrom("-1.1.1") === "1.1.1",  true,    "the - symbol must be removed from string");
});

tap.test("Test the computation of no of keys for an object", async ({ equal }) => {
    equal(keysNo({ a: "a", b: "b", c: "c" }) === 3,  true,    "the number of keys of the object must be correct");
    equal(keysNo({ a: "a", b: "b" }) === 2,          true,    "the number of keys of the object must be correct");
    equal(keysNo({ a: "a" }) === 1,                  true,    "the number of keys of the object must be correct");
    equal(keysNo({ }) === 0,                         true,    "the number of keys of the object must be correct");
    equal(keysNo(undefined) === 0,                   true,    "the number of keys of the object must be correct");
});

tap.test("Test the computation of index, key & values for an object", async ({ same }) => {
    same(
        entriesOfEntries({ a: "a", b: "b", c: "c" }),
         [["0", ["a", "a"]], ["1", ["b", "b"]], ["2", ["c", "c"]]],       
        "the index, keys, values of the object must be correct"
    );
    same(
        entriesOfEntries({ a: "a", b: "b"}),
        [["0", ["a", "a"]], ["1", ["b", "b"]]],       
        "the index, keys, values of the object must be correct"
    );
    same(
        entriesOfEntries({ a: "a" }),
        [["0", ["a", "a"]]],       
        "the index, keys, values of the object must be correct"
    );
    same(
        entriesOfEntries({}),
        [],       
        "the index, keys, values of the object must be correct"
    );
});

tap.test("Test the computation of the key used for caching", async ({ equal }) => {
    equal(
        computeKey("foo-bar", "1.1.1") === "foo-bar-1.1.1",       
        true,    
        "the key used for cache must be correct"
    );
});