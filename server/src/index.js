import express from 'express';
import { Config } from './configs/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/globalError.middleware.js';

const app = express();
const PORT = Config.PORT;

// ✅ Correct CORS setup
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    // add production domains here later
  ],
  credentials: true, // 👈 lowercase 'c'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ API routes
app.use("/api", apiRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
