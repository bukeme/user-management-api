import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("posts").del();
  await knex("addresses").del();
  await knex("users").del();

  const users = [];
  const addresses = [];

  for (let i = 1; i <= 20; i++) {
    users.push({ name: `User ${i}`, email: `user${i}@email.com` });
  }

  await knex("users").insert(users);

  const userList = await knex("users").pluck("id").limit(15);
  for (let userId of userList) {
    addresses.push({
      userId: userId,
      street: `Street ${userId}`,
      city: `City ${userId}`,
      state: `State ${userId}`,
      zip: `Zip ${userId}`,
    });
  }
  await knex("addresses").insert(addresses);

  for (let userId of userList) {
    let posts = [];
    for (let i = 1; i <= 3; i++) {
      posts.push({
        userId: userId,
        title: `Post ${i} for User ${userId}`,
        body: `This is post ${i} for user ${userId}`,
      });
    }
    await knex("posts").insert(posts);
    posts = [];
  }
}
