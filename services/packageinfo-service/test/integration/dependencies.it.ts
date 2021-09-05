import server from "../../src/server";
import nock from "nock";
import supertest from "supertest";
import tap from "tap";
import jsonschema from "jsonschema";
import { dependenciesSchema } from "../../src/routes/dependenciesRoute";
import TreeNode from "../../src/models/domain/Tree";

// Mocha like DSL
const describe = tap.test;
const it = tap.test;

const loadMocks = async () => {
    nock("https://registry.npmjs.org")
        .get("/fastify/latest")
        .replyWithFile(200, __dirname + '/stubs/fastify.json', {
            'Content-Type': 'application/json',
        })
        .get("/@fastify/ajv-compiler/1.0.0")
        .replyWithFile(200, __dirname + '/stubs/ajv-compiler.json', {
            'Content-Type': 'application/json',
        })
        .get("/ajv/8.6.2")
        .replyWithFile(200, __dirname + '/stubs/ajv.json', {
            'Content-Type': 'application/json',
        })
        .get("/abstract-logging/2.0.0")
        .replyWithFile(200, __dirname + '/stubs/abstract-logging.json', {
            'Content-Type': 'application/json',
        })
        .get("/avvio/7.1.2")
        .replyWithFile(200, __dirname + '/stubs/avvio.json', {
            'Content-Type': 'application/json',
        })
        .get("/archy/1.0.0")
        .replyWithFile(200, __dirname + '/stubs/archy.json', {
            'Content-Type': 'application/json',
        })
        .get("/fast-deep-equal/3.1.1")
        .replyWithFile(200, __dirname + '/stubs/fast-deep-equal.json', {
            'Content-Type': 'application/json',
        })
        .get("/foo-bar/42.42.42")
        .reply(404);
}

describe("Dependencies fetch happy flows", async () => {
    it("should return the tree view of dependencies represented as json", async ({ equal }) => {
        await server.ready();
        await loadMocks();
    
        const response = await supertest(server.server)
            .get("/dependencies/fastify")
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8');
        equal((response.body as TreeNode).childs.length > 0, true, "the response must contain an array of childs packages");    

        const schemaValidation = new jsonschema
            .Validator()
            .validate(response.body, dependenciesSchema.response[200]);
        equal(schemaValidation.valid, true, "the response must respect the defined schema");
    });

    it("should return the tree view of dependencies represented as json of depth 0", async ({ equal }) => {
        await server.ready();
        await loadMocks();
    
        const response = await supertest(server.server)
            .get("/dependencies/fastify")
            .query({ depth: 0 })
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8');
        (response.body as TreeNode).childs
            .forEach((node) => {
                equal(node.childs.length === 0, true, "Because of depth 0, childs should not childs")
            })
        
        const schemaValidation = new jsonschema
            .Validator()
            .validate(response.body, dependenciesSchema.response[200]);
        equal(schemaValidation.valid, true, "the response must respect the defined schema");
    });
});

describe("Dependencies fetch error flows", async () => {
    it("should return error when the package is not found with depth unspecified", async ({ equal }) => {
        await server.ready();
        await loadMocks();

        const response = await supertest(server.server)
            .get("/dependencies/foo-bar")
            .expect(404)
            .expect('Content-Type', 'application/json; charset=utf-8');

        const schemaValidation = new jsonschema
            .Validator()
            .validate(response.body, dependenciesSchema.response[404]);
        equal(schemaValidation.valid, true, "the response must respect the defined schema");
    });

    it("should return error when the package is not found with depth specified", async ({ equal }) => {
        await server.ready();
        await loadMocks();

        const response = await supertest(server.server)
            .get("/dependencies/foo-bar")
            .query({ depth: 0 })
            .expect(404)
            .expect('Content-Type', 'application/json; charset=utf-8');

        const schemaValidation = new jsonschema
            .Validator()
            .validate(response.body, dependenciesSchema.response[404]);
        equal(schemaValidation.valid, true, "the response must respect the defined schema");
    });
});