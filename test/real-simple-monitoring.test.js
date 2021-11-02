const app = require("../index");
const supertest = require("supertest");
let server;

// beforeEach(done => {
//     server = app.on("listening", () => done(null))
// })

test("GET /", async () => {
    await supertest(app).get("/")
    .expect(200)
    .then((response) => {
        expect(response.text).toBe("OK!");
    });
});