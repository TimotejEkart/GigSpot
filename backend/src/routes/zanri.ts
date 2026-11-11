import { Router } from "express";
import { prisma } from "../lib/prisma";

export const zanriRouter = Router();

zanriRouter.get("/", async (_req, res) => {
  const zanri = await prisma.zanr.findMany({ orderBy: { ime: "asc" } });
  res.json({ zanri });
});
