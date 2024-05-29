import { Request, Response } from "express";
import { CarModel, CarType } from "../models/CarModel";
import cloudinary from "../middleware/cloudinary";

export default class CarController {
    public static async getCars(req: Request, res: Response): Promise<Response> {
        try {
            const cars = await CarModel.query();
            return res.status(200).json({ data: cars, message: "Send cars data" });
        } catch (error) {
            console.error("Error fetching cars:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    public static async store(req: Request, res: Response): Promise<Response> {
        // destructure name dan price dari req.body, dan berikan tipe data
        const { name, price }: { name: string, price: number } = req.body;
        const file = req.file; // get file dari request

        // kondisi apabila name, price, atau file tidak ada
        if (!name || !price || !file) {
            return res.status(400).json({ message: 'Name, price, and image are required' });
        }

        // konversi buffer ke base64
        const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        // upload image ke cloudinary
        const result = await cloudinary.uploader.upload(fileBase64, { folder: 'cars' });

        const imageUrl = result.secure_url;
        if (!imageUrl) {
            return res.status(500).json({ message: 'Cannot retrieve image from Cloudinary' });
        }

        const data: Partial<CarType> & { image: string } = {
            name,
            price,
            image: imageUrl,
        };

        try {
            const newCar = await CarModel.query().insert(data);
            return res.status(201).json({ message: 'Store car successfully', data: newCar });
        } catch (error) {
            return res.status(500).json({ message: 'Store car failed', error });
        }
    }

    public static async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { name, price }: { name: string, price: number } = req.body;
        const file = req.file;

        try {
            const car = await CarModel.query().findById(id);

            if (!car) {
                return res.status(404).json({ message: "Car not found" });
            }
            
            let imageUrl: string | undefined;

            if (file) {
                const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;                
                const result = await cloudinary.uploader.upload(fileBase64, { folder: 'cars' });

                const imageUrl = result.secure_url;

                if (!imageUrl) {
                    return res.status(500).json({ message: 'Cannot retrieve image from Cloudinary' });
                }
            }

            const updateData: Partial<CarType> = {};


            if (name) updateData.name = name;
            if (price) updateData.price = price;
            if (imageUrl) updateData.image = imageUrl;
            updateData.updated_at = new Date();


            const updatedCar = await CarModel.query().patchAndFetchById(id, updateData);

            return res.status(201).json({ message: "Car successfully updated", data: updatedCar });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error });
        }
    }

    public static async deleteCar(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const deletedParams: number = await CarModel.query().deleteById(id);

            if (deletedParams === 0) {
                return res.status(404).json({ message: "Car not found" });
            }

            return res.status(201).json({ message: "Car successfully deleted" });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error });
        }
    }
}