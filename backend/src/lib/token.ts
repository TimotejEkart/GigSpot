import jwt from "jsonwebtoken";
import type { CookieOptions } from "express";
import { config } from "../config";
import type { Vloga } from "../generated/prisma/enums";

export type Prijavljen = { id: number; vloga: Vloga };

export const PISKOTEK = "token";
const TRAJANJE_S = 7 * 24 * 60 * 60;

export const moznostiPiskotka: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: config.produkcija,
  path: "/",
};

export function ustvariToken(uporabnik: Prijavljen): string {
  return jwt.sign({ vloga: uporabnik.vloga }, config.jwtSecret, {
    subject: String(uporabnik.id),
    expiresIn: TRAJANJE_S,
    algorithm: "HS256",
  });
}

export function preveriToken(token: string): Prijavljen | null {
  try {
    const vsebina = jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] }) as jwt.JwtPayload;
    return { id: Number(vsebina.sub), vloga: vsebina.vloga };
  } catch {
    return null;
  }
}

export const trajanjePiskotkaMs = TRAJANJE_S * 1000;
