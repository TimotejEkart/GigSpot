import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { authRouter } from "./routes/auth";
import { obravnavaNapak } from "./middleware/napake";

export const app = express();

app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);

app.use("/api", (_req, res) => {
  res.status(404).json({ napaka: "Ta pot ne obstaja." });
});

app.use(obravnavaNapak);
