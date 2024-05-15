import { Request, Response } from "express";
import { CarModel, CarType } from "../models/CarModel";
import cloudinary from "../middleware/cloudinary";

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
        try {
            // destructure name dan price dari req.body, dan berikan tipe data
            const { name, price }: { name: string, price: number } = req.body;
            const file = req.file; // get file dari request

            // kondisi apabila name, price, atau file tidak ada
            if (!name || !price || !file) {
                return res.status(400).json({ message: 'Name, price, and image are required' });
            }

            // return promise untuk handle proses asynchronous dengan cloudinary upload
            return new Promise((resolve, reject) => {
                // membuat upload stream cloudinary
                const result = cloudinary.uploader.upload_stream(
                    {folder: 'cars'}, // image akan disimpan pada folder cars
                    async (error, result) => { // callback function untuk handle result atau error pada saat proses upload
                        if (error) { 
                            // send http code 400 apabila ada error ketika proses uploading
                            return res.status(400).json({ message: 'Error uploading', error: error });
                        }
    
                        const imageUrl = result?.secure_url; // get secure url dari image yang sudah diupload
    
                        // send http code 500 apabila image url tidak ada
                        if (!imageUrl) {
                            return res.status(500).json({ message: 'Cannot retrieve image to Cloudinary'});
                        }
    
                        // membuat data object untuk dikirimkan ke database
                        const data: Partial<CarType> & { image: string } = {
                            name,
                            price,
                            image: imageUrl
                        };
    
                        try {
                            // create car menggunakan method create pada model dengan data 
                            const newCar = await CarModel.create(data);
                            return res.status(201).json({ message: 'Store car successfully', data: newCar});
                        } catch (error) {
                            return res.status(500).json({ message: error });
                        }
                    }
                );

                // cek apabila file ada sebagai stream dan dikirim ke Cloudinary upload stream
                if (file.stream) {
                    file.stream.pipe(result);
                } else if (file.buffer) { // jika file ada sebagai buffer
                    const stream = require('stream'); // import modul stream
                    const bufferStream = new stream.PassThrough(); // buat instance dari PassThrough, berguna untuk readable dan writeable stream
                    bufferStream.end(file.buffer); // write file.buffer ke PassThrough stream
                    bufferStream.pipe(result); // pipes data dari PassThrough steam ke Cloudinary upload stream
                }
                else {
                    return res.status(400).json({ message: "File upload error" });
                }
            });
        } catch (error) {
            return res.status(500).json({message: "Internal Server Error", error });
        }
    }
}