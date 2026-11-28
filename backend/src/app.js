import express from "express";
// require all the routes here
import authRouter from "./routes/auth.routes.js";

const app = express();
app.use(express.json());


app.use("/api/auth", authRouter);

export default app;
