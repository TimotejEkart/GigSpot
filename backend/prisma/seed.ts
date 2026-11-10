import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { Vloga } from "../src/generated/prisma/enums";

const zanri = [
  "Rock",
  "Indie",
  "Punk",
  "Metal",
  "Pop",
  "Jazz",
  "Blues",
  "Funk",
  "Folk",
  "Hip-hop",
  "Elektronska",
  "Alternativa",
];

const TESTNO_GESLO = "geslo123";

const uporabniki = [
  { email: "glasbenik@gigspot.test", prikaznoIme: "Testni glasbenik", vloga: Vloga.GLASBENIK },
  { email: "organizator@gigspot.test", prikaznoIme: "Testni organizator", vloga: Vloga.ORGANIZATOR },
  { email: "obiskovalec@gigspot.test", prikaznoIme: "Testni obiskovalec", vloga: Vloga.OBISKOVALEC },
];

async function main() {
  for (const ime of zanri) {
    await prisma.zanr.upsert({ where: { ime }, update: {}, create: { ime } });
  }

  const gesloHash = await bcrypt.hash(TESTNO_GESLO, 10);
  for (const u of uporabniki) {
    await prisma.uporabnik.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, gesloHash },
    });
  }

  console.log(`Žanri: ${zanri.length}, testni uporabniki: ${uporabniki.length} (geslo: ${TESTNO_GESLO})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
