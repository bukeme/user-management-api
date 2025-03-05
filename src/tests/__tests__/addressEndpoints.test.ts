import request from "supertest";
import express from "express";
const userRoutes = require("../../routes/userRoutes");
const addressRoutes = require("../../routes/addressRoutes");
import { db } from "../../db/db";

const app = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/addresses", addressRoutes);

let testuserId: number;
const uniqueEmail = `user${Date.now()}@example.com`;

beforeAll(async () => {
  const [id] = await db("users").insert({
    name: "Test User",
    email: uniqueEmail,
  });
  testuserId = id;
});

afterAll(async () => {
  await db("addresses").del();
  await db("users").del();
  await db.destroy();
});

describe("Address Endpoints", () => {
  it("should return 404 for GET /addresses/:userId if address does not exist", async () => {
    const res = await request(app).get(`/addresses/${testuserId}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Address not found");
  });

  it("should create a new address with POST /addresses", async () => {
    const addressData = {
      userId: testuserId,
      street: "123 Test St",
      city: "Testville",
      state: "TS",
      zip: "12345",
    };

    const res = await request(app).post("/addresses").send(addressData);
    expect(res.status).toBe(201);
    expect(res.body.data[0]).toHaveProperty("id");
    expect(res.body.data[0]).toMatchObject(addressData);
  });

  it("should get the address for a user with GET /addresses/:userId", async () => {
    const res = await request(app).get(`/addresses/${testuserId}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("userId", testuserId);
    expect(res.body.data).toHaveProperty("street", "123 Test St");
  });

  it("should update the address for a user with PATCH /addresses/:userId", async () => {
    const updateData = {
      street: "456 New St",
      city: "Newville",
      state: "NS",
      zip: "67890",
    };
    const res = await request(app)
      .patch(`/addresses/${testuserId}`)
      .send(updateData);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Address updated successfully");

    const getRes = await request(app).get(`/addresses/${testuserId}`);
    expect(getRes.body.data).toMatchObject(updateData);
  });

  it("should return 400 for PATCH /addresses/:userId if no update data is provided", async () => {
    const res = await request(app).patch(`/addresses/${testuserId}`).send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "At least one field must be provided for update"
    );
  });
});
