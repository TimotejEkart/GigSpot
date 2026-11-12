import type { RequestHandler } from "express";
import { PISKOTEK, preveriToken } from "../lib/token";
import type { Vloga } from "../generated/prisma/enums";

export const requireAuth: RequestHandler = (req, res, next) => {
  const token: string | undefined = req.cookies?.[PISKOTEK];
  const uporabnik = token ? preveriToken(token) : null;

  if (!uporabnik) {
    res.status(401).json({ napaka: "Za to dejanje se morate prijaviti." });
    return;
  }

  req.uporabnik = uporabnik;
  next();
};

// Prebere uporabnika, če je prijavljen, sicer nadaljuje brez njega (za javne strani).
export const optionalAuth: RequestHandler = (req, _res, next) => {
  const token: string | undefined = req.cookies?.[PISKOTEK];
  const uporabnik = token ? preveriToken(token) : null;
  if (uporabnik) req.uporabnik = uporabnik;
  next();
};

// Uporablja se za requireAuth, npr. router.post("/", requireAuth, requireRole("ORGANIZATOR"), ...)
export function requireRole(...vloge: Vloga[]): RequestHandler {
  return (req, res, next) => {
    if (!req.uporabnik) {
      res.status(401).json({ napaka: "Za to dejanje se morate prijaviti." });
      return;
    }
    if (!vloge.includes(req.uporabnik.vloga)) {
      res.status(403).json({ napaka: "Za to dejanje nimate pravic." });
      return;
    }
    next();
  };
}
