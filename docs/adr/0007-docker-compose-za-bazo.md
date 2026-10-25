# Docker Compose za PostgreSQL

* Status: sprejeto
* Datum: 2026-10-24

## Kontekst in problem

PostgreSQL (ADR 0002) je treba nekje zagnati. Če vsak namesti bazo po svoje, se različice in gesla razidejo. Gostovana baza od začetka pa pomeni račun in internet že za lokalni zagon.

## Obravnavane alternative

* Ročna namestitev PostgreSQL na računalnik
* Docker Compose samo za bazo
* Gostovana baza od začetka (npr. Neon, Supabase)

## Odločitev

Izbrana alternativa: **Docker Compose za bazo**, da imajo vsi enako različico PostgreSQL, ne da bi jo nameščali ročno. Frontend in backend ostaneta lokalna `npm` procesa, kot je v dokumentu 04.

## Posledice

### Pozitivne

* En ukaz (`docker compose up -d`) dvigne bazo.
* Geslo, vrata in verzija so zapisani v datoteki, ne nekje po zapiskih.
* Produkcijsko gostovanje baze lahko kasneje zamenjamo, ne da bi spremenili kodo.

### Negativne

* Potreben je Docker Desktop.
* Če Docker ne teče, aplikacija nima baze.

## Prednosti in slabosti alternativ

### Ročna namestitev

* Dobro, ker Docker ni potreben.
* Slabo, ker se namestitve med Windowsom in različicami razlikujejo.

### Docker Compose

* Dobro, ker je baza ponovljiva in ločena od kode.
* Slabo, ker je Docker dodatna odvisnost na računalniku.

### Gostovana baza

* Dobro, ker ni lokalnega strežnika in je baza dosegljiva od koderkoli.
* Slabo, ker zagon ni več samo lokalen in brez zunanjih računov.
