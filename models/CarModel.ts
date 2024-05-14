import { DateType, Model } from "./Model";

export type CarType = {
    id: number;
    name: string;
    price: number;
    image: string;
}

export class CarModel extends Model {
    static tableName = 'cars';

    public static async create<Payload>(data: Payload): Promise<CarType & DateType> {
        return super.insert<Payload, CarType>({
            ...data,
        })  
    }
}