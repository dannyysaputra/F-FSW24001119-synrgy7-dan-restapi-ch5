import knex from "knex";
import { database } from "../database";

export type DateType = {
    created_at: Date;
    updated_at: Date;
};

type ResponseType<Result> = Promise<Result & DateType>;

export class Model {
    static tableName: string;

    private static get table() {
        if (!this.tableName) {
            throw new Error('You must provide a table name');   
        }

        return database(this.tableName);
    }

    public static async all<Result>(): Promise<Result[]> {
        return this.table;
    }

    public static async insert<Payload, Result>(data: Payload): ResponseType<Result> {
        const [result] = await this.table.insert(data).returning('*');
        return result; 
    }

    public static async delete(id: string): Promise<number> {
        return this.table.where({ id }).del();
    }

    public static async findById<Result>(id: string): ResponseType<Result> {
        return this.table.where('id', id).first();
    }

    public static async findBy<Payload, Result>(data: Payload): ResponseType<Result | null> {
        return this.table.where(data as string).first();
    }
}