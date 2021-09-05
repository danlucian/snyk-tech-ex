import tap from "tap";
import { noDependenciesFound } from "../../src/models/api/ApiError";

tap.test("No dependencies found error test", async ({ same }) => {
    const error = noDependenciesFound();

    same(error, {
        statusCode: 404, 
        error: "Data error", 
        message: "No depedencies were found!"
    }, "The generic error should return the specified message");
});
