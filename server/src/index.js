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


app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND
  ],
  credentials: true, 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//  api routes
app.use("/api", apiRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
