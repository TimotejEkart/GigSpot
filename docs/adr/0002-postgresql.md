# PostgreSQL namesto dokumentne baze

* Status: sprejeto
* Datum: 2026-10-24

## Kontekst in problem

Podatki so močno povezani: glasbenik je v več bendih, termin ima več prijav, žanri se vežejo na bende in termine, pri izboru zasedbe pa moramo v enem koraku sprejeti bend, zapreti termin in zavrniti ostale prijave. Katero bazo izberemo, da to ostane pravilno?

## Obravnavane alternative

* PostgreSQL
* MongoDB
* SQLite

## Odločitev

Izbrana alternativa: **PostgreSQL**, ker so podatki relacijski in pri izboru zasedbe potrebujemo transakcije. Tako se zasedba ne more prenapolniti, tudi če dva organizatorja klikneta hkrati.

## Posledice

### Pozitivne

* Tuje ključe in števila mest v zasedbi lahko preverja baza.
* Transakcija pokrije sprejem, zaprtje termina in zavrnitev ostalih prijav.
* Shema se ujema z ER modelom iz dokumenta 03.

### Negativne

* Shemo je treba načrtovati vnaprej, spremembe gredo prek migracij.
* Za lokalni zagon potrebujemo PostgreSQL.

## Prednosti in slabosti alternativ

### PostgreSQL

* Dobro, ker so relacije in transakcije vgrajene.
* Slabo, ker je nastavitev težja kot pri datotečni bazi.

### MongoDB

* Dobro, ker je vstavljanje dokumentov hitro in shema je ohlapna.
* Slabo, ker za veliko povezav med tabelami ni najbolj primerna.
* Slabo, ker bi transakcijo za izbor zasedbe težje zapisal pravilno.

### SQLite

* Dobro, ker ne rabiš ločenega strežnika, baza je ena datoteka.
* Slabo, ker ni namenjena sočasnim zapisom in kasnejšemu gostovanju.
