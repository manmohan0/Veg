import express from "express";
import cors from "cors";
import codeRouter from "./routes/codeRoutes.js";
import deployRouter from "./routes/deployRoutes.js";

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND : "http://localhost:5173",
}));

app.use(codeRouter)
app.use(deployRouter)

export default app;