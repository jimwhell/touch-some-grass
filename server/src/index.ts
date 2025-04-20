import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import searchRoutes from "./routes/searchRoutes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:4200"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(json());

const PORT = process.env.PORT || 3000;

app.use("/api/search", searchRoutes);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status ? res.status : res.status(500);
  res.json(error);
});

app.listen(PORT, () => {
  console.log(`App is listening at port: ${PORT}`);
});
