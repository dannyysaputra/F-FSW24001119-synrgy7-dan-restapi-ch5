import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('cars', function (table) {
        table.uuid('id').defaultTo(knex.fn.uuid()).primary;
        table.string('name', 255).notNullable();
        table.integer('price').notNullable();
        table.string('image').notNullable();
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('cars');
}

