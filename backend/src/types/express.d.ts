import type { Prijavljen } from "../lib/token";

declare global {
  namespace Express {
    interface Request {
      uporabnik?: Prijavljen;
    }
  }
}

export {};
