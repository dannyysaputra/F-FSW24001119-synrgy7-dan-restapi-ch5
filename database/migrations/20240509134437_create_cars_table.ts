import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('cars', function (table) {
        table.increments('id').primary;
        table.string('name', 255).notNullable();
        table.integer('price').notNullable();
        
    })
}


export async function down(knex: Knex): Promise<void> {
}

