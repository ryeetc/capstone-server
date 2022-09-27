/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable("user", function(table) {
            table.increments("id");
            table.string("first_name").notNullable();
            table.string("last_name").notNullable();
            table.string("password").notNullable();
            table.string("email").notNullable().unique();
        })
        .createTable("meds", function(table){
            table.increments("id");
            table.integer("user_id").unsigned().notNullable();
            table.string("med_name", 30).notNullable();
            table.integer("amount").unsigned().notNullable();
            table.string("dosage").notNullable();
            table.string("time_interval").notNullable();
            table
                .foreign("user_id")
                .references("id")
                .inTable("user")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")
        })
        .createTable("log", function(table){
            table.increments("id");
            table.integer("user_id").unsigned().notNullable();
            table.integer("med_id").unsigned().notNullable();
            table.string("med_name", 30).notNullable();
            table.string("dosage").notNullable();
            table.string("comment", 250);
            table.boolean("ifTaken").defaultTo(false)
            table.timestamp('date_taken').defaultTo(knex.fn.now());
            table
                .foreign("user_id")
                .references("id")
                .inTable("user")
                .onUpdate("CASCADE")
                .onDelete("CASCADE")
            // table
            //     .foreign("med_id")
            //     .references("id")
            //     .inTable("meds")
            //     .onUpdate("NO ACTION")
            //     .onDelete("NO ACTION")
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('log').dropTable('meds').dropTable('user');
};
