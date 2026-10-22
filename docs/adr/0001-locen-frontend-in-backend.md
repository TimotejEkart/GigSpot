# Ločen frontend in backend

* Status: sprejeto
* Datum: 2026-10-22

## Kontekst in problem

GigSpot ima javni koledar in del za prijavljene uporabnike (bendi, termini, prijave). Ista poslovna pravila mora videti spletna aplikacija, kasneje pa morda tudi drug odjemalec. Kako razdelimo kodo, da ostane pregledna in da se pravila ne podvajajo?

## Obravnavane alternative

* Enovit sistem (npr. Next.js z API potmi v istem projektu)
* Ločen React frontend in Express backend, povezana prek REST API-ja
* Backend kot BaaS (Firebase), frontend samo kliče gotove storitve

## Odločitev

Izbrana alternativa: **ločen React frontend in Express backend**, ker sta v nalogi 1 že predvidena dva jasna dela sistema, REST API pa lahko kasneje uporablja tudi drug odjemalec. Frontend skrbi za prikaz, backend za pravila in podatke.

## Posledice

### Pozitivne

* Dela sta neodvisna, zato ju je lažje razumeti in testirati.
* Isti API lahko kasneje uporabi npr. mobilna aplikacija.
* Pravila (konflikti, polna zasedba) živijo na enem mestu.

### Negativne

* Lokalno je treba zagnati dva procesa in bazo.
* Treba je usklajevati pogodbo API-ja med obema deloma.

## Prednosti in slabosti alternativ

### Enovit sistem

* Dobro, ker je za majhen MVP manj mape in manj zaganjanja.
* Slabo, ker se UI in poslovna logika hitro prepleteta.

### Ločen frontend in backend

* Dobro, ker je razdelitev enaka opisu v dokumentu 04.
* Slabo, ker je na začetku več nastavljanja.

### BaaS

* Dobro, ker bi avtentikacijo in bazo dobil pripravljeno.
* Slabo, ker pravil, kot je konflikt člana, tam ne zapišemo pregledno, projekt pa je težje zagnati samo lokalno.
