import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { router } from "./router";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

// routing
app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

// app.get("/api/v1/cars", getCars);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});