import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { HttpNapaka } from "../middleware/napake";
import { konfliktiClanov, opisKonfliktov } from "./termini";

const statusShema = z.object({
  status: z.enum(["OZJI_IZBOR", "SPREJETA", "ZAVRNJENA"], { error: "Neveljaven status prijave." }),
});

export const prijaveRouter = Router();

prijaveRouter.use(requireAuth, requireRole("ORGANIZATOR"));

// sprememba statusa prijave, ko je zasedba polna se termin zapre
prijaveRouter.patch("/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = statusShema.parse(req.body);

  const prijava =
    Number.isInteger(id) && id > 0
      ? await prisma.prijava.findUnique({ where: { id }, include: { termin: { include: { prizorisce: true } } } })
      : null;
  if (!prijava) throw new HttpNapaka(404, "Prijava ne obstaja.");
  if (prijava.termin.prizorisce.lastnikId !== req.uporabnik!.id) {
    throw new HttpNapaka(403, "Prijavo lahko obravnava samo lastnik prizorišča.");
  }
  if (prijava.status !== "ODDANA" && prijava.status !== "OZJI_IZBOR") {
    throw new HttpNapaka(400, "Te prijave ni več mogoče spremeniti.");
  }

  if (status === "SPREJETA") {
    const konflikti = await konfliktiClanov(prijava.bendId, prijava.termin.datum);
    if (konflikti.length > 0) throw new HttpNapaka(409, `Prijave ni mogoče sprejeti. ${opisKonfliktov(konflikti)}`);
  }

  const rezultat = await prisma.$transaction(async (tx) => {
    // zaklene termin, da dva hkratna sprejema ne prenapolnita zasedbe
    await tx.$queryRaw`SELECT id FROM termini WHERE id = ${prijava.terminId} FOR UPDATE`;
    const termin = await tx.termin.findUniqueOrThrow({ where: { id: prijava.terminId } });
    if (termin.status !== "ODPRT") throw new HttpNapaka(400, "Termin ni več odprt.");

    let sprejetih = await tx.prijava.count({ where: { terminId: termin.id, status: "SPREJETA" } });
    if (status === "SPREJETA" && sprejetih >= termin.stBendov) {
      throw new HttpNapaka(400, "Zasedba je že polna.");
    }

    const posodobljena = await tx.prijava.update({ where: { id }, data: { status } });
    if (status === "SPREJETA") sprejetih++;

    const polna = sprejetih === termin.stBendov;
    if (polna) {
      await tx.termin.update({ where: { id: termin.id }, data: { status: "ZAPRT" } });
      await tx.prijava.updateMany({
        where: { terminId: termin.id, status: { in: ["ODDANA", "OZJI_IZBOR"] } },
        data: { status: "ZAVRNJENA" },
      });
    }

    return { prijava: posodobljena, termin: { id: termin.id, status: polna ? "ZAPRT" : "ODPRT", sprejetih } };
  });

  res.json(rezultat);
});
