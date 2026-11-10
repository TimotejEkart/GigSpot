-- CreateEnum
CREATE TYPE "vloga" AS ENUM ('OBISKOVALEC', 'GLASBENIK', 'ORGANIZATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "vloga_v_bendu" AS ENUM ('VODJA', 'CLAN');

-- CreateEnum
CREATE TYPE "status_clana" AS ENUM ('POVABLJEN', 'AKTIVEN');

-- CreateEnum
CREATE TYPE "nacin_placila" AS ENUM ('HONORAR', 'DELITEV_VSTOPNINE', 'BREZ');

-- CreateEnum
CREATE TYPE "status_termina" AS ENUM ('ODPRT', 'ZAPRT', 'OBJAVLJEN', 'IZVEDEN', 'ODPOVEDAN');

-- CreateEnum
CREATE TYPE "status_prijave" AS ENUM ('ODDANA', 'OZJI_IZBOR', 'SPREJETA', 'ZAVRNJENA', 'UMAKNJENA', 'ODPOVEDANA');

-- CreateTable
CREATE TABLE "uporabniki" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "geslo_hash" TEXT NOT NULL,
    "prikazno_ime" TEXT NOT NULL,
    "telefon" TEXT,
    "vloga" "vloga" NOT NULL DEFAULT 'OBISKOVALEC',
    "ustvarjeno" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "posodobljeno" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uporabniki_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bendi" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "mesto" TEXT NOT NULL,
    "opis" TEXT,
    "tehnicne_zahteve" TEXT,
    "ustvarjeno" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "posodobljeno" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bendi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clani_benda" (
    "bend_id" INTEGER NOT NULL,
    "uporabnik_id" INTEGER NOT NULL,
    "vloga_v_bendu" "vloga_v_bendu" NOT NULL DEFAULT 'CLAN',
    "status" "status_clana" NOT NULL DEFAULT 'POVABLJEN',

    CONSTRAINT "clani_benda_pkey" PRIMARY KEY ("bend_id","uporabnik_id")
);

-- CreateTable
CREATE TABLE "prizorisca" (
    "id" SERIAL NOT NULL,
    "lastnik_id" INTEGER NOT NULL,
    "ime" TEXT NOT NULL,
    "mesto" TEXT NOT NULL,
    "naslov" TEXT NOT NULL,
    "kapaciteta" INTEGER,
    "kontakt_telefon" TEXT,
    "kontakt_email" TEXT,
    "ustvarjeno" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "posodobljeno" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prizorisca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "termini" (
    "id" SERIAL NOT NULL,
    "prizorisce_id" INTEGER NOT NULL,
    "datum" DATE NOT NULL,
    "st_bendov" INTEGER NOT NULL,
    "nacin_placila" "nacin_placila" NOT NULL,
    "znesek" DECIMAL(10,2),
    "rok_prijave" TIMESTAMP(3) NOT NULL,
    "status" "status_termina" NOT NULL DEFAULT 'ODPRT',
    "ustvarjeno" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "posodobljeno" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "termini_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prijave" (
    "id" SERIAL NOT NULL,
    "termin_id" INTEGER NOT NULL,
    "bend_id" INTEGER NOT NULL,
    "sporocilo" TEXT,
    "status" "status_prijave" NOT NULL DEFAULT 'ODDANA',
    "ustvarjeno" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "posodobljeno" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prijave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zanri" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,

    CONSTRAINT "zanri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zanri_bendov" (
    "bend_id" INTEGER NOT NULL,
    "zanr_id" INTEGER NOT NULL,

    CONSTRAINT "zanri_bendov_pkey" PRIMARY KEY ("bend_id","zanr_id")
);

-- CreateTable
CREATE TABLE "zanri_terminov" (
    "termin_id" INTEGER NOT NULL,
    "zanr_id" INTEGER NOT NULL,

    CONSTRAINT "zanri_terminov_pkey" PRIMARY KEY ("termin_id","zanr_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uporabniki_email_key" ON "uporabniki"("email");

-- CreateIndex
CREATE INDEX "clani_benda_uporabnik_id_idx" ON "clani_benda"("uporabnik_id");

-- CreateIndex
CREATE INDEX "prizorisca_lastnik_id_idx" ON "prizorisca"("lastnik_id");

-- CreateIndex
CREATE INDEX "termini_prizorisce_id_idx" ON "termini"("prizorisce_id");

-- CreateIndex
CREATE INDEX "termini_status_datum_idx" ON "termini"("status", "datum");

-- CreateIndex
CREATE INDEX "prijave_bend_id_idx" ON "prijave"("bend_id");

-- CreateIndex
CREATE UNIQUE INDEX "prijave_termin_id_bend_id_key" ON "prijave"("termin_id", "bend_id");

-- CreateIndex
CREATE UNIQUE INDEX "zanri_ime_key" ON "zanri"("ime");

-- CreateIndex
CREATE INDEX "zanri_bendov_zanr_id_idx" ON "zanri_bendov"("zanr_id");

-- CreateIndex
CREATE INDEX "zanri_terminov_zanr_id_idx" ON "zanri_terminov"("zanr_id");

-- AddForeignKey
ALTER TABLE "clani_benda" ADD CONSTRAINT "clani_benda_bend_id_fkey" FOREIGN KEY ("bend_id") REFERENCES "bendi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clani_benda" ADD CONSTRAINT "clani_benda_uporabnik_id_fkey" FOREIGN KEY ("uporabnik_id") REFERENCES "uporabniki"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prizorisca" ADD CONSTRAINT "prizorisca_lastnik_id_fkey" FOREIGN KEY ("lastnik_id") REFERENCES "uporabniki"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "termini" ADD CONSTRAINT "termini_prizorisce_id_fkey" FOREIGN KEY ("prizorisce_id") REFERENCES "prizorisca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prijave" ADD CONSTRAINT "prijave_termin_id_fkey" FOREIGN KEY ("termin_id") REFERENCES "termini"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prijave" ADD CONSTRAINT "prijave_bend_id_fkey" FOREIGN KEY ("bend_id") REFERENCES "bendi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zanri_bendov" ADD CONSTRAINT "zanri_bendov_bend_id_fkey" FOREIGN KEY ("bend_id") REFERENCES "bendi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zanri_bendov" ADD CONSTRAINT "zanri_bendov_zanr_id_fkey" FOREIGN KEY ("zanr_id") REFERENCES "zanri"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zanri_terminov" ADD CONSTRAINT "zanri_terminov_termin_id_fkey" FOREIGN KEY ("termin_id") REFERENCES "termini"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zanri_terminov" ADD CONSTRAINT "zanri_terminov_zanr_id_fkey" FOREIGN KEY ("zanr_id") REFERENCES "zanri"("id") ON DELETE CASCADE ON UPDATE CASCADE;
