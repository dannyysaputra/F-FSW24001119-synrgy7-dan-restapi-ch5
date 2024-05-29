import BaseModel  from "./Model";

export type CarType = {
    id: number;
    name: string;
    price: number;
    image: string;
    created_at: Date; 
    updated_at: Date; 
}

export class CarModel extends BaseModel {
    static tableName = 'cars';

    id!: number;
    name!: string;
    price!: number;
    image!: string;
}