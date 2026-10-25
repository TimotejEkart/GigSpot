# TypeScript na frontendu in backendu

* Status: sprejeto
* Datum: 2026-10-24

## Kontekst in problem

Med odjemalcem in strežnikom hodijo isti podatki: termini, prijave, vloge. Če sta jezika različna ali oba brez tipov, se napaka (npr. napačno ime polja) pokaže šele v brskalniku.

## Obravnavane alternative

* JavaScript na obeh straneh
* TypeScript samo na backendu, JavaScript na frontendu
* TypeScript na obeh straneh

## Odločitev

Izbrana alternativa: **TypeScript na obeh straneh**, ker se pri prenašanju podatkov med frontendom in backendom ujamejo napake že ob prevajanju, ne šele ob kliku.

## Posledice

### Pozitivne

* Statusi prijav (`ODDANA`, `SPREJETA`, …) in vloge so lahko skupni tipi.
* Urejevalnik pokaže napačno polje, preden kodo poženeš.
* En jezik na obeh straneh pomeni manj preklapljanja.

### Negativne

* Začetna nastavitev (Vite, `tsconfig`) traja dlje kot čisti JavaScript.
* Tipi zahtevajo malo več pisanja.

## Prednosti in slabosti alternativ

### JavaScript povsod

* Dobro, ker je prag najnižji in ni prevajanja.
* Slabo, ker se napake v JSON pogodbi pokažejo pozno.

### TypeScript samo na backendu

* Dobro, ker strežnik, kjer so pravila, ostane bolj varen.
* Slabo, ker frontend še vedno ugiba obliko odgovorov.

### TypeScript povsod

* Dobro, ker je pogodba med deloma jasnejša.
* Slabo, ker moram TypeScript obvladati na obeh koncih.
