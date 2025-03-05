import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("addresses", (table) => {
    table.increments("id").primary(); // Primary key
    table
      .integer("userId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .unique();
    table.string("street").notNullable();
    table.string("city").notNullable();
    table.string("state").notNullable();
    table.string("zip").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("addresses");
}
