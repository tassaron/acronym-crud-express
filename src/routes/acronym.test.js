import request from "supertest";
import app from "../app";
import 'regenerator-runtime/runtime'
// ^ this import needed to use async await https://stackoverflow.com/questions/42535270


// TEST UTILS
const wait = async (ms) => {
  await(new Promise((whatever) => setTimeout(whatever, ms)));
};

// TEST DATA
const LOLdata = {
  "acronym": "LOL",
  "definition": "lots of love"
}


// GET TEST #1
describe("GET /acronym endpoint without any data", () => {
  it("GET /acronym without ?search returns 400", async () => {
    const response = await request(app).get("/acronym");
    expect(response.statusCode).toBe(400);
  });

  it("GET /acronym with ?search= returns 400", async () => {
    const response = await request(app).get("/acronym?search=");
    expect(response.statusCode).toBe(400);
  });

  it("GET /acronym with ?search=LOL returns 200", async () => {
    const response = await request(app).get("/acronym?search=LOL");
    expect(response.statusCode).toBe(200);
  });

  it("GET /acronym with ?search=LOL returns empty array", async () => {
    const response = await request(app).get("/acronym?search=LOL");
    expect(response.body).toEqual([]);
  });

  it("GET /acronym with ?search=LOL has Pagination-Count == 0", async () => {
    const response = await request(app).get("/acronym?search=LOL");
    expect(response.headers["pagination-count"]).toBe("0");
  });
});


// POST TEST #1
describe("POST /acronym endpoint with LOL acronym", () => {
  it("POST /acronym with new LOL acronym returns 201", async () => {
    const response = await request(app)
      .post("/acronym")
      .send(LOLdata);
    expect(response.statusCode).toBe(201);
    wait(100);
  });

  it("POST /acronym without body returns 400", async () => {
    const response = await request(app)
      .post("/acronym").send({});
    expect(response.statusCode).toBe(400);
    wait(100);
  });
});


// GET TEST #2
describe("GET /acronym endpoint with LOL acronym", () => {
  // give json file time to be written by previous test
  wait(1000);

  it("GET /acronym without ?search returns 400", async () => {
    const response = await request(app).get("/acronym");
    expect(response.statusCode).toBe(400);
  });

  it("GET /acronym with ?search= returns 400", async () => {
    const response = await request(app).get("/acronym?search=");
    expect(response.statusCode).toBe(400);
  });

  it("GET /acronym with ?search=LOL returns 200", async () => {
    const response = await request(app).get("/acronym?search=LOL");
    expect(response.statusCode).toBe(200);
  });

  it("GET /acronym with ?search=LOL returns array of length 1", async () => {
    const response = await request(app).get("/acronym?search=LOL");
    expect(response.body.length).toBe(1);
  });

  it("GET /acronym with ?search=LOL has Pagination-Count == 1", async () => {
    const response = await request(app).get("/acronym?search=LOL");
    expect(response.headers["pagination-count"]).toBe("1");
  });
});


// DELETE TEST #1
describe("DELETE /acronym/$uuid endpoint", () => {
  it("delete existing LOL acronym", async () => {
    const getResponse = await request(app).get("/acronym?search=LOL");
    const uuid = getResponse.body[0]["_id"];
    const firstResponse = await request(app).delete(`/acronym/${uuid}`);
    expect(firstResponse.statusCode).toBe(204);
    // wait for json file to be written to
    wait(100);
    const secondResponse = await request(app).delete(`/acronym/${uuid}`);
    expect(secondResponse.statusCode).toBe(400);
  });
});
