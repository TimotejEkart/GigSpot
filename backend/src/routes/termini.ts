import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { optionalAuth, requireAuth, requireRole } from "../middleware/auth";
import { HttpNapaka } from "../middleware/napake";

const NACINI_PLACILA = ["HONORAR", "DELITEV_VSTOPNINE", "BREZ"] as const;

// današnji datum v lokalnem času kot YYYY-MM-DD
function danes(): string {
  return new Date().toLocaleDateString("sv-SE");
}

const terminShema = z
  .object({
    prizorisceId: z.number({ error: "Izberite prizorišče." }).int(),
    datum: z.iso.date({ error: "Datum je obvezen." }),
    stBendov: z
      .number({ error: "Število bendov je obvezno." })
      .int("Število bendov mora biti celo število.")
      .min(1, "Število bendov mora biti od 1 do 6.")
      .max(6, "Število bendov mora biti od 1 do 6."),
    nacinPlacila: z.enum(NACINI_PLACILA, { error: "Izberite način plačila." }),
    znesek: z.number({ error: "Znesek mora biti število." }).positive("Znesek mora biti večji od 0.").max(100000).nullish(),
    rokPrijave: z
      .string({ error: "Rok za prijave je obvezen." })
      .min(1, "Rok za prijave je obvezen.")
      .refine((v) => !Number.isNaN(new Date(v).getTime()), "Neveljaven rok za prijave."),
    zanri: z.array(z.number().int(), { error: "Izberite vsaj en žanr." }).min(1, "Izberite vsaj en žanr."),
  })
  .superRefine((t, ctx) => {
    if (t.datum <= danes()) {
      ctx.addIssue({ code: "custom", path: ["datum"], message: "Datum koncerta mora biti v prihodnosti." });
    }
    const rok = new Date(t.rokPrijave);
    if (rok <= new Date()) {
      ctx.addIssue({ code: "custom", path: ["rokPrijave"], message: "Rok za prijave mora biti v prihodnosti." });
    } else if (rok >= new Date(`${t.datum}T00:00`)) {
      ctx.addIssue({ code: "custom", path: ["rokPrijave"], message: "Rok za prijave mora biti pred datumom koncerta." });
    }
    if (t.nacinPlacila === "HONORAR" && (t.znesek === null || t.znesek === undefined)) {
      ctx.addIssue({ code: "custom", path: ["znesek"], message: "Pri honorarju je znesek obvezen." });
    }
  });

const vkljuci = {
  prizorisce: true,
  zanri: { include: { zanr: true } },
} as const;

type TerminIzBaze = Awaited<ReturnType<typeof najdiTermin>>;

function najdiTermin(id: number) {
  return prisma.termin.findUnique({ where: { id }, include: vkljuci });
}

// pretvori termin v obliko za odjemalca, kontakt doda samo, če ga uporabnik sme videti
function zaOdjemalca(t: NonNullable<TerminIzBaze>, sKontaktom: boolean) {
  return {
    id: t.id,
    datum: t.datum.toISOString().slice(0, 10),
    stBendov: t.stBendov,
    nacinPlacila: t.nacinPlacila,
    znesek: t.znesek === null ? null : Number(t.znesek),
    rokPrijave: t.rokPrijave,
    status: t.status,
    zanri: t.zanri.map((z) => z.zanr),
    prizorisce: {
      id: t.prizorisce.id,
      ime: t.prizorisce.ime,
      mesto: t.prizorisce.mesto,
      naslov: t.prizorisce.naslov,
      ...(sKontaktom
        ? { kontaktTelefon: t.prizorisce.kontaktTelefon, kontaktEmail: t.prizorisce.kontaktEmail }
        : {}),
    },
  };
}

export const terminiRouter = Router();

// razpis termina na svojem prizorišču
terminiRouter.post("/", requireAuth, requireRole("ORGANIZATOR"), async (req, res) => {
  const podatki = terminShema.parse(req.body);

  const prizorisce = await prisma.prizorisce.findUnique({ where: { id: podatki.prizorisceId } });
  if (!prizorisce || prizorisce.lastnikId !== req.uporabnik!.id) {
    res.status(400).json({ napaka: "Neveljavni podatki.", polja: { prizorisceId: "Izberite eno od svojih prizorišč." } });
    return;
  }

  const zanriIds = [...new Set(podatki.zanri)];
  if ((await prisma.zanr.count({ where: { id: { in: zanriIds } } })) !== zanriIds.length) {
    res.status(400).json({ napaka: "Neveljavni podatki.", polja: { zanri: "Izbran žanr ne obstaja." } });
    return;
  }

  const termin = await prisma.termin.create({
    data: {
      prizorisceId: prizorisce.id,
      datum: new Date(`${podatki.datum}T00:00:00Z`),
      stBendov: podatki.stBendov,
      nacinPlacila: podatki.nacinPlacila,
      znesek: podatki.nacinPlacila === "HONORAR" ? podatki.znesek : null,
      rokPrijave: new Date(podatki.rokPrijave),
      status: "ODPRT",
      zanri: { create: zanriIds.map((zanrId) => ({ zanrId })) },
    },
    include: vkljuci,
  });

  res.status(201).json({ termin: zaOdjemalca(termin, true) });
});

// termini na prizoriščih prijavljenega organizatorja
terminiRouter.get("/mine", requireAuth, requireRole("ORGANIZATOR"), async (req, res) => {
  const termini = await prisma.termin.findMany({
    where: { prizorisce: { lastnikId: req.uporabnik!.id } },
    orderBy: { datum: "asc" },
    include: vkljuci,
  });
  res.json({ termini: termini.map((t) => zaOdjemalca(t, true)) });
});

// podrobnosti termina; kontakt prizorišča samo za prijavljene glasbenike in organizatorje
terminiRouter.get("/:id", optionalAuth, async (req, res) => {
  const id = Number(req.params.id);
  const termin = Number.isInteger(id) && id > 0 ? await najdiTermin(id) : null;
  if (!termin) throw new HttpNapaka(404, "Termin ne obstaja.");

  const vloga = req.uporabnik?.vloga;
  const sKontaktom = vloga === "GLASBENIK" || vloga === "ORGANIZATOR";
  res.json({ termin: zaOdjemalca(termin, sKontaktom) });
});
