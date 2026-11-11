import { Router, type Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { HttpNapaka } from "../middleware/napake";
import { PISKOTEK, moznostiPiskotka, trajanjePiskotkaMs, ustvariToken, type Prijavljen } from "../lib/token";

const BCRYPT_KROGI = 10;

// za primerjavo, ko uporabnik ne obstaja, da odgovor traja enako dolgo
const LAZNI_HASH = bcrypt.hashSync("ne-obstaja", BCRYPT_KROGI);

const email = z
  .string({ error: "E-naslov je obvezen." })
  .trim()
  .toLowerCase()
  .pipe(z.email("Neveljaven e-naslov."));

const registracijaShema = z.object({
  email,
  geslo: z
    .string({ error: "Geslo je obvezno." })
    .min(8, "Geslo mora imeti vsaj 8 znakov.")
    .max(72, "Geslo je predolgo."),
  prikaznoIme: z
    .string({ error: "Ime je obvezno." })
    .trim()
    .min(2, "Ime mora imeti vsaj 2 znaka.")
    .max(60, "Ime je predolgo."),
  telefon: z
    .string()
    .trim()
    .max(30, "Telefon je predolg.")
    .optional()
    .transform((v) => v || null),
  // ADMIN se ne more registrirati sam
  vloga: z.enum(["OBISKOVALEC", "GLASBENIK", "ORGANIZATOR"], {
    error: "Izberite vlogo: obiskovalec, glasbenik ali organizator.",
  }),
});

const prijavaShema = z.object({
  email,
  geslo: z.string({ error: "Geslo je obvezno." }).min(1, "Geslo je obvezno."),
});

const javniPodatki = {
  id: true,
  email: true,
  prikaznoIme: true,
  telefon: true,
  vloga: true,
} as const;

function nastaviPiskotek(res: Response, uporabnik: Prijavljen) {
  res.cookie(PISKOTEK, ustvariToken(uporabnik), { ...moznostiPiskotka, maxAge: trajanjePiskotkaMs });
}

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const podatki = registracijaShema.parse(req.body);

  const obstaja = await prisma.uporabnik.findUnique({ where: { email: podatki.email } });
  if (obstaja) {
    throw new HttpNapaka(409, "Uporabnik s tem e-naslovom že obstaja.");
  }

  const uporabnik = await prisma.uporabnik.create({
    data: {
      email: podatki.email,
      gesloHash: await bcrypt.hash(podatki.geslo, BCRYPT_KROGI),
      prikaznoIme: podatki.prikaznoIme,
      telefon: podatki.telefon,
      vloga: podatki.vloga,
    },
    select: javniPodatki,
  });

  nastaviPiskotek(res, uporabnik);
  res.status(201).json({ uporabnik });
});

authRouter.post("/login", async (req, res) => {
  const { email, geslo } = prijavaShema.parse(req.body);

  const uporabnik = await prisma.uporabnik.findUnique({ where: { email } });
  const pravilno = await bcrypt.compare(geslo, uporabnik?.gesloHash ?? LAZNI_HASH);

  if (!uporabnik || !pravilno) {
    throw new HttpNapaka(401, "Napačen e-naslov ali geslo.");
  }

  nastaviPiskotek(res, uporabnik);
  res.json({
    uporabnik: {
      id: uporabnik.id,
      email: uporabnik.email,
      prikaznoIme: uporabnik.prikaznoIme,
      telefon: uporabnik.telefon,
      vloga: uporabnik.vloga,
    },
  });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(PISKOTEK, moznostiPiskotka);
  res.status(204).end();
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const uporabnik = await prisma.uporabnik.findUnique({
    where: { id: req.uporabnik!.id },
    select: javniPodatki,
  });

  if (!uporabnik) {
    res.clearCookie(PISKOTEK, moznostiPiskotka);
    throw new HttpNapaka(401, "Za to dejanje se morate prijaviti.");
  }

  res.json({ uporabnik });
});
