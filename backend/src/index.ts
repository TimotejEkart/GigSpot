import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({
     origin: "http://localhost:5173",
    }));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.listen(PORT, () => {
  console.log(`Server teče  http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});