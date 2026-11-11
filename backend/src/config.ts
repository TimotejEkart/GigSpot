import "dotenv/config";

function obvezna(ime: string): string {
  const vrednost = process.env[ime];
  if (!vrednost) {
    throw new Error(`Manjka okoljska spremenljivka ${ime} (glej .env.example)`);
  }
  return vrednost;
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: obvezna("JWT_SECRET"),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  produkcija: process.env.NODE_ENV === "production",
};
