import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("posts", (table) => {
    table.increments("id").primary(); // Primary key
    table.string("title").notNullable(); // Post title
    table.text("body").notNullable(); // Post content
    table
      .integer("userId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    // Establish a foreign key relation to the users table
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("posts");
}
