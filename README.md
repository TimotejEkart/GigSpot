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
backend/     REST API (Express)
docs/        dokumentacija, wireframi in ADR
```

Mape `frontend/` in `backend/` sta za zdaj prazni.

## Razvoj
Delamo po GitHub Flow. Spremembe gredo na lastno vejo, v `main` pa samo prek pull requesta.

