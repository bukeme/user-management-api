import request from "supertest";
import express from "express";
import postRoutes from "../../routes/postRoutes";
import userRoutes from "../../routes/userRoutes";
import { db } from "../../db/db";

const app = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

let testUserId: number;
let testPostId: number;
const uniqueEmail = `user${Date.now()}@example.com`;

beforeAll(async () => {
  const [id] = await db("users").insert({
    name: "Post Test User",
    email: uniqueEmail,
  });
  testUserId = id;
});

afterAll(async () => {
  await db("posts").del();
  await db("users").del();
  await db.destroy();
});

describe("Post Endpoints", () => {
  it("should create a new post with POST /posts", async () => {
    const postData = {
      title: "Test Post",
      body: "This is a test post body",
      userId: testUserId,
    };
    const res = await request(app).post("/posts").send(postData);
    expect(res.status).toBe(201);
    expect(res.body.data[0]).toHaveProperty("id");
    expect(res.body.data[0].title).toBe(postData.title);
    expect(res.body.data[0].body).toBe(postData.body);
    expect(res.body.data[0].userId).toBe(testUserId);
    testPostId = res.body.data[0].id;
  });

  it("should return all posts for a specific user with GET /posts?userId=", async () => {
    const res = await request(app).get(`/posts?userId=${testUserId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((post: any) => {
      expect(post.userId).toBe(testUserId);
    });
  });

  it("should delete a post with DELETE /posts/:id", async () => {
    const res = await request(app).delete(`/posts/${testPostId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Post deleted successfully");

    const resNotFound = await request(app).delete(`/posts/${testPostId}`);
    expect(resNotFound.status).toBe(404);
    expect(resNotFound.body).toHaveProperty("message", "Post not found!");
  });
});
