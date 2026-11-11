import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { HttpNapaka } from "../middleware/napake";

const bendShema = z.object({
  ime: z.string({ error: "Ime je obvezno." }).trim().min(1, "Ime je obvezno.").max(100, "Ime je predolgo."),
  mesto: z.string({ error: "Mesto je obvezno." }).trim().min(1, "Mesto je obvezno.").max(60, "Mesto je predolgo."),
  opis: z.string().trim().max(1000, "Opis je predolg.").nullish().transform((v) => v || null),
  tehnicneZahteve: z.string().trim().max(1000, "Vnos je predolg.").nullish().transform((v) => v || null),
  zanri: z
    .array(z.number().int(), { error: "Izberite vsaj en žanr." })
    .min(1, "Izberite vsaj en žanr."),
});

const povabiloShema = z.object({
  email: z.string({ error: "E-naslov je obvezen." }).trim().toLowerCase().min(1, "E-naslov je obvezen."),
});

function idBenda(vrednost: string): number {
  const id = Number(vrednost);
  if (!Number.isInteger(id) || id < 1) throw new HttpNapaka(404, "Bend ne obstaja.");
  return id;
}

export const bendiRouter = Router();

bendiRouter.use(requireAuth, requireRole("GLASBENIK"));

// ustvarjanje benda, ustvarjalec postane vodja
bendiRouter.post("/", async (req, res) => {
  const podatki = bendShema.parse(req.body);
  const zanriIds = [...new Set(podatki.zanri)];

  const steviloZanrov = await prisma.zanr.count({ where: { id: { in: zanriIds } } });
  if (steviloZanrov !== zanriIds.length) {
    res.status(400).json({ napaka: "Neveljavni podatki.", polja: { zanri: "Izbran žanr ne obstaja." } });
    return;
  }

  const bend = await prisma.bend.create({
    data: {
      ime: podatki.ime,
      mesto: podatki.mesto,
      opis: podatki.opis,
      tehnicneZahteve: podatki.tehnicneZahteve,
      clani: { create: { uporabnikId: req.uporabnik!.id, vlogaVBendu: "VODJA", status: "AKTIVEN" } },
      zanri: { create: zanriIds.map((zanrId) => ({ zanrId })) },
    },
  });

  res.status(201).json({ bend });
});

// bendi, v katerih je uporabnik aktiven član, in njegova odprta povabila
bendiRouter.get("/mine", async (req, res) => {
  const uporabnikId = req.uporabnik!.id;

  const bendi = await prisma.bend.findMany({
    where: { clani: { some: { uporabnikId, status: "AKTIVEN" } } },
    orderBy: { ime: "asc" },
    include: {
      zanri: { include: { zanr: true } },
      clani: { include: { uporabnik: { select: { id: true, prikaznoIme: true, email: true } } } },
    },
  });

  const povabila = await prisma.clanBenda.findMany({
    where: { uporabnikId, status: "POVABLJEN" },
    include: { bend: { select: { id: true, ime: true, mesto: true } } },
  });

  res.json({
    bendi: bendi.map((b) => ({
      id: b.id,
      ime: b.ime,
      mesto: b.mesto,
      opis: b.opis,
      tehnicneZahteve: b.tehnicneZahteve,
      zanri: b.zanri.map((z) => z.zanr),
      clani: b.clani.map((c) => ({ ...c.uporabnik, vlogaVBendu: c.vlogaVBendu, status: c.status })),
      jeVodja: b.clani.some((c) => c.uporabnikId === uporabnikId && c.vlogaVBendu === "VODJA"),
    })),
    povabila: povabila.map((p) => p.bend),
  });
});

// vodja povabi glasbenika po e-mailu
bendiRouter.post("/:id/invite", async (req, res) => {
  const bendId = idBenda(req.params.id);
  const { email } = povabiloShema.parse(req.body);

  const vodja = await prisma.clanBenda.findUnique({
    where: { bendId_uporabnikId: { bendId, uporabnikId: req.uporabnik!.id } },
  });
  if (!vodja || vodja.vlogaVBendu !== "VODJA" || vodja.status !== "AKTIVEN") {
    throw new HttpNapaka(403, "Člane lahko povabi samo vodja benda.");
  }

  const glasbenik = await prisma.uporabnik.findUnique({ where: { email } });
  if (!glasbenik || glasbenik.vloga !== "GLASBENIK") {
    throw new HttpNapaka(404, "Glasbenik s tem e-mail ne obstaja");
  }

  const obstaja = await prisma.clanBenda.findUnique({
    where: { bendId_uporabnikId: { bendId, uporabnikId: glasbenik.id } },
  });
  if (obstaja) {
    throw new HttpNapaka(409, obstaja.status === "AKTIVEN" ? "Glasbenik je že član benda." : "Glasbenik je že povabljen.");
  }

  await prisma.clanBenda.create({
    data: { bendId, uporabnikId: glasbenik.id, vlogaVBendu: "CLAN", status: "POVABLJEN" },
  });

  res.status(201).json({ povabljen: { id: glasbenik.id, prikaznoIme: glasbenik.prikaznoIme, email: glasbenik.email } });
});

// sprejem povabila: POVABLJEN -> AKTIVEN
bendiRouter.post("/:id/invitation/accept", async (req, res) => {
  const bendId = idBenda(req.params.id);
  const { count } = await prisma.clanBenda.updateMany({
    where: { bendId, uporabnikId: req.uporabnik!.id, status: "POVABLJEN" },
    data: { status: "AKTIVEN" },
  });
  if (count === 0) throw new HttpNapaka(404, "Povabilo ne obstaja.");
  res.status(204).end();
});

// zavrnitev povabila: povabilo se izbriše
bendiRouter.post("/:id/invitation/decline", async (req, res) => {
  const bendId = idBenda(req.params.id);
  const { count } = await prisma.clanBenda.deleteMany({
    where: { bendId, uporabnikId: req.uporabnik!.id, status: "POVABLJEN" },
  });
  if (count === 0) throw new HttpNapaka(404, "Povabilo ne obstaja.");
  res.status(204).end();
});
