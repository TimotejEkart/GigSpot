import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";

// prazen niz iz obrazca shrani kot null
function neobvezno(max: number) {
  return z
    .string()
    .trim()
    .max(max, "Vnos je predolg.")
    .nullish()
    .transform((v) => v || null);
}

const prizorisceShema = z.object({
  ime: z.string({ error: "Ime je obvezno." }).trim().min(2, "Ime mora imeti vsaj 2 znaka.").max(100, "Ime je predolgo."),
  mesto: z.string({ error: "Mesto je obvezno." }).trim().min(2, "Mesto je obvezno.").max(60, "Mesto je predolgo."),
  naslov: z.string({ error: "Naslov je obvezen." }).trim().min(3, "Naslov je obvezen.").max(150, "Naslov je predolg."),
  kapaciteta: z
    .number({ error: "Kapaciteta mora biti število." })
    .int("Kapaciteta mora biti celo število.")
    .min(1, "Kapaciteta mora biti vsaj 1.")
    .max(100000, "Kapaciteta je prevelika.")
    .nullish()
    .transform((v) => v ?? null),
  kontaktTelefon: neobvezno(30),
  kontaktEmail: neobvezno(120).refine((v) => v === null || z.email().safeParse(v).success, "Neveljaven e-naslov."),
});

export const prizoriscaRouter = Router();

prizoriscaRouter.use(requireAuth, requireRole("ORGANIZATOR"));

// prizorišča prijavljenega organizatorja
prizoriscaRouter.get("/", async (req, res) => {
  const prizorisca = await prisma.prizorisce.findMany({
    where: { lastnikId: req.uporabnik!.id },
    orderBy: { ime: "asc" },
  });
  res.json({ prizorisca });
});

prizoriscaRouter.post("/", async (req, res) => {
  const podatki = prizorisceShema.parse(req.body);

  const prizorisce = await prisma.prizorisce.create({
    data: { ...podatki, lastnikId: req.uporabnik!.id },
  });

  res.status(201).json({ prizorisce });
});
