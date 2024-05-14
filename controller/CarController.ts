import { Request, Response } from "express";
import { CarModel, CarType } from "../models/CarModel";


export default class CarController {
    public static async getCars(req: Request, res: Response): Promise<Response> {
        try {
            const cars = await CarModel.all();
            return res.status(200).json({ data: cars, message: "Send cars data" });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    public static async store(req: Request, res: Response): Promise<Response> {
        console.log(req.body);
        try {
            const data: CarType = req.body;

            if (!data.name || !data.price || !data.image) {
                return res.status(400).json({ message: 'Name, price, and image are required' });
            }

            const newCar = await CarModel.create(data);
            return res.status(201).json({ data: newCar, message: "Car successfully created" });
        } catch (error) {
            return res.status(500).json({message: "Internal Server Error", error });
        }
    }
}