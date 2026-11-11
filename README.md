# GigSpot

Spletna platforma, ki lokalne bende poveže s prizorišči (klubi, bari, kulturni centri). Organizator razpiše termin, vodja benda se prijavi, po izboru zasedbe se koncert samodejno pojavi v javnem koledarju.

Projekt nastaja v okviru predmeta Razvoj informacijskih rešitev in storitev (FERI UM).

## Tehnologije

| Del | Sklad |
|-----|--------|
| Frontend | React, TypeScript, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Baza | PostgreSQL, Prisma ORM |
| Avtentikacija | JWT v httpOnly piškotku, bcrypt |
| Lokalni razvoj | Docker Compose, Git, GitHub |

## Dokumentacija

- [01 Zasnova rešitve](docs/01-zasnova-resitve.md)
- [02 Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
- [03 Podatkovni model](docs/03-podatkovni-model.md)
- [04 Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
- [05 Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
- [06 Wireframes](docs/06-wireframes.md)
- [Arhitekturne odločitve (ADR)](docs/adr/)

## Struktura

```
frontend/    odjemalec (React)
backend/     REST API (Express, Prisma)
docs/        dokumentacija, wireframi in ADR
```

## Lokalni zagon

Potrebuješ [Node.js](https://nodejs.org/) (20 ali novejši) in [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### 1. Nastavitve

V korenu projekta in v mapi `backend` skopiraj `.env.example` v `.env`:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

V `backend/.env` nastavi `JWT_SECRET` na dolg naključen niz, npr. izpis tega ukaza:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Geslo baze je v obeh `.env` datotekah privzeto `spremeni-me`. Če ga spremeniš, ga spremeni na obeh mestih (`POSTGRES_PASSWORD` in `DATABASE_URL`).

### 2. Baza

Docker Desktop mora biti zagnan.

```bash
docker compose up -d
```

### 3. Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Backend teče na http://localhost:3000. Migracija ustvari tabele, seed pa doda žanre in testne uporabnike.

### 4. Frontend

V novem terminalu:

```bash
cd frontend
npm install
npm run dev
```

Aplikacija je na http://localhost:5173.

### Testni računi

Vsi imajo geslo `geslo123`.

| E-naslov | Vloga |
|----------|-------|
| glasbenik@gigspot.test | glasbenik |
| organizator@gigspot.test | organizator |
| obiskovalec@gigspot.test | obiskovalec |

## Razvoj
Delamo po GitHub Flow. Spremembe gredo na lastno vejo, v `main` pa samo prek pull requesta.

Veja `main` je zaščitena, force push in brisanje veje sta onemogočena.

