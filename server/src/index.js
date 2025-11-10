import express from 'express';
import { Config } from './configs/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/globalError.middleware.js';
import dotenv from 'dotenv';

const app = express();
const PORT = Config.PORT;

dotenv.config({
  path: "./.env"
})



app.use(
  cors({
    origin: [
      process.env.FRONTEND
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    credentials: true, // allow cookies/auth headers
  })
);

app.options("*", cors()); // preflight requests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//  api routes
app.use("/api", apiRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
