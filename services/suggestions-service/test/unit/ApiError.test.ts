import tap from "tap";
import { genericError } from "../../src/models/ApiError";

tap.test("Generic error with message", async ({ same }) => {
    const error = genericError("Test message");
    
    same(error, {
        statusCode: 500, 
        error: "Generic error", 
        message: "Test message"
    }, "The generic error should return the specified message");
});

tap.test("Generic error with default", async ({ same }) => {
    const error = genericError();
    
    same(error, {
        statusCode: 500, 
        error: "Generic error", 
        message: "An unknown error occured"
    }, "The generic error should return the specified message");
});