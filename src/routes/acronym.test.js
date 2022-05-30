import request from "supertest";
import app from "../app";
import 'regenerator-runtime/runtime'
// ^ this import needed to use async await https://stackoverflow.com/questions/42535270

it("GET /acronym without ?search returns 404", async () => {
  const response = await request(app).get("/acronym");
  expect(response.statusCode).toBe(404);
});

it("GET /acronym with ?search= returns 404", async () => {
  const response = await request(app).get("/acronym?search=");
  expect(response.statusCode).toBe(404);
});

it("GET /acronym with ?search=LOL returns 200", async () => {
  const response = await request(app).get("/acronym?search=LOL");
  expect(response.statusCode).toBe(200);
});