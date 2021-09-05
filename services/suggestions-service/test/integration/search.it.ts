import server from "../../src/server";
import { searchSchema } from "../../src/routes/searchRoute";
import nock from "nock";
import supertest from "supertest";
import tap from "tap";
import jsonschema from "jsonschema";

// Mocha like DSL
const describe = tap.test;
const it = tap.test;

describe("Packages search based on keyword happy flow", async () => {
    it("should return a list of packages along with their metadata for keyword 'expr'", async ({ equal }) => {
        await server.ready();
        nock("https://registry.npmjs.org")
            .get("/-/v1/search")
            .query({ text: "expr" })
            .replyWithFile(200, __dirname + '/stubs/search-expr.json', {
                'Content-Type': 'application/json',
            });
        
        const response = await supertest(server.server)
              .get("/search/suggestions?name=expr")
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8');
        
        const schemaValidation = new jsonschema
            .Validator()
            .validate(response.body, searchSchema.response[200])
            .valid;

        equal((response.body as Array<any>).length > 0, true, "the response must contain an array of packages");
        equal(schemaValidation, true, "the response must respect the defined schema");

    });

    it("should return a list of packages along with their metadata for keyword 'snyk'", async ({ equal }) => {
        await server.ready();
        nock("https://registry.npmjs.org")
            .get("/-/v1/search")
            .query({ text: "snyk" })
            .replyWithFile(200, __dirname + '/stubs/search-snyk.json', {
                'Content-Type': 'application/json',
            });
        
        const response = await supertest(server.server)
            .get("/search/suggestions?name=snyk")
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8');
    
        const schemaValidation = new jsonschema
            .Validator()
            .validate(response.body, searchSchema.response[200])
            .valid;

        equal((response.body as Array<any>).length > 0, true, "the response must contain an array of packages");
        equal(schemaValidation, true, "the response must respect the defined schema");
    });
});

describe("Packages search based on keyword error flow", async () => {
    it("should return error when the registry is unavailable", async ({ equal }) => {
        await server.ready();
        nock("https://registry.npmjs.org")
            .get("/-/v1/search")
            .query({ text: "snyk" })
            .reply(503, "Service Unavailable")
            .persist(); // due to possible retry
        
        const response = await supertest(server.server)
              .get("/search/suggestions?name=snyk")
              .expect(500)
              .expect('Content-Type', 'application/json; charset=utf-8');
    
        const schemaValidation = new jsonschema
              .Validator()
              .validate(response.body, searchSchema.response[500])
              .valid;
  
        equal(schemaValidation, true, "the response must respect the defined schema");
    });

    it("should return error when the 'name' query param is not used in request", async ({ equal }) => {
        await server.ready();
        
        const response = await supertest(server.server)
              .get("/search/suggestions")
              .expect(400)
              .expect('Content-Type', 'application/json; charset=utf-8');
    
        const schemaValidation = new jsonschema
              .Validator()
              .validate(response.body, searchSchema.response[400])
              .valid;
  
        equal(schemaValidation, true, "the response must respect the defined schema");
    });
});