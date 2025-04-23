import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import placeRoutes from "./routes/placeRoutes";
import dotenv from "dotenv";
import cors from "cors";
import { CustomError } from "./errors/customError";
import morgan from "morgan";

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:4200"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(json());
app.use(morgan("tiny"));

const PORT = process.env.PORT || 3000;

app.use("/api/places", placeRoutes);

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).send(error.message);
  }
);

app.listen(PORT, () => {
  console.log(`App is listening at port: ${PORT}`);
});
