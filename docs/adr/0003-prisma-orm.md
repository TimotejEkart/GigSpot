# Prisma ORM

* Status: sprejeto
* Datum: 2026-10-24

## Kontekst in problem

Do PostgreSQL lahko dostopamo z golim SQL, s klasičnim ORM-jem ali z orodjem, ki poleg poizvedb vodi tudi shemo in migracije. Izbira vpliva na to, kako hitro uvajamo spremembe in koliko napak ujamemo pred zagonom.

## Obravnavane alternative

* Goli SQL (npr. `pg` knjižnica)
* Prisma
* Sequelize

## Odločitev

Izbrana alternativa: **Prisma**, ker je shema zapisana na enem mestu, migracije so vgrajene, v TypeScriptu pa dobimo tipe za tabele. To se ujema z odločitvijo za TypeScript na backendu (ADR 0004).

## Posledice

### Pozitivne

* Shema, migracije in tipi so na istem mestu, zato je vzdrževanje bolj pregledno. Če spremeniš polje, se to vidi v kodi, ne šele ko aplikacija že teče.
* Transakcije za izbor zasedbe zapišemo v enem koraku.
* Ker SQL pišemo manj sami, je manj napak pri povezovanju tabel.

### Negativne

* Prisma je še en sloj, ki se ga je treba naučiti.
* Za kakšno težjo poizvedbo je Prisma manj priročna, takrat napišemo SQL sami.

## Prednosti in slabosti alternativ

### Goli SQL

* Dobro, ker imaš popoln nadzor in ni dodatne knjižnice.
* Slabo, ker shema, migracije in tipi niso povezani.
* Slabo, ker bi vsak JOIN pisal in preverjal ročno.

### Prisma

* Dobro, ker pokrije shemo, migracije in dostop v enem orodju.
* Slabo, ker smo odvisni od Prisme in njenih omejitev.

### Sequelize

* Dobro, ker je v Node ekosistemu dolgo prisoten.
* Slabo, ker je tipska podpora šibkejša in migracije manj pregledne kot pri Prismi.
