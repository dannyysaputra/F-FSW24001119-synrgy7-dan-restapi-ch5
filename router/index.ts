import { Router } from 'express';
import type { Request, Response } from 'express';
import CarController from '../controller/CarController';

export const router = Router();

router.get('/cars', (req: Request, res: Response) => {
    CarController.getCars(req, res);
});

router.post('/cars', (req: Request, res: Response) => {
    CarController.store(req, res);
});