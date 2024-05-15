import { Router } from 'express';
import type { Request, Response } from 'express';
import CarController from '../controller/CarController';
import upload from '../middleware/multer';

export const router = Router();

router.get('/cars', (req: Request, res: Response) => {
    CarController.getCars(req, res);
});

router.post('/cars', upload.single('image'), (req, res) => {
    CarController.store(req, res);
});