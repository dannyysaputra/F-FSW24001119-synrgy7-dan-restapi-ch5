import { Router } from 'express';
import type { Request, Response } from 'express';
import CarController from '../controller/CarController';
import upload from '../middleware/multer';

export const router = Router();

router.get('/cars', (req: Request, res: Response) => {
    CarController.getCars(req, res);
});

router.post('/cars', upload.single('image'), (req: Request, res: Response) => {
    CarController.store(req, res);
});

router.put('/cars/:id', upload.single('image'), (req: Request, res: Response) => {
    CarController.update(req, res);
});

router.delete('/cars/:id', (req: Request, res: Response) => {
    CarController.deleteCar(req, res);
});