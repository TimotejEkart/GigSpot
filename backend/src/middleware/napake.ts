import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export class HttpNapaka extends Error {
  status: number;

  constructor(status: number, sporocilo: string) {
    super(sporocilo);
    this.status = status;
  }
}

export const obravnavaNapak: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const polja: Record<string, string> = {};
    for (const tezava of err.issues) {
      const polje = tezava.path.join(".") || "telo";
      polja[polje] ??= tezava.message;
    }
    res.status(400).json({ napaka: "Neveljavni podatki.", polja });
    return;
  }

  if (err instanceof HttpNapaka) {
    res.status(err.status).json({ napaka: err.message });
    return;
  }

  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ napaka: "Telo zahtevka ni veljaven JSON." });
    return;
  }

  console.error(err);
  res.status(500).json({ napaka: "Napaka na strežniku." });
};
