import request from "supertest";
import express from "express";
import userRoutes from "../../routes/userRoutes";
import { db } from "../../db/db";

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

describe("User Endpoints", () => {
  afterAll(async () => {
    await db("users").del();
    await db.destroy();
  });

  it("should create a new user", async () => {
    const uniqueEmail = `user${Date.now()}@example.com`;
    const res = await request(app)
      .post("/users")
      .send({ name: "Alice", email: uniqueEmail });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.name).toBe("Alice");
    expect(res.body.data.email).toBe(uniqueEmail);
  });

  it("should return paginated list of users", async () => {
    const res = await request(app).get("/users?pageNumber=0&pageSize=5");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return user count", async () => {
    const res = await request(app).get("/users/count");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("total");
  });

  it("should fetch user by ID", async () => {
    const uniqueEmail = `user${Date.now()}@example.com`;
    const newUser = await request(app)
      .post("/users")
      .send({ name: "Bob", email: uniqueEmail });

    const userId = newUser.body.data.id;
    const res = await request(app).get(`/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("id", userId);
  });
});
