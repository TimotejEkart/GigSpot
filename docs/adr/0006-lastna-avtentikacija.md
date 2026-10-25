# Lastna avtentikacija namesto zunanjega ponudnika

* Status: sprejeto
* Datum: 2026-10-24

## Kontekst in problem

Uporabnik potrebuje račun z vlogo obiskovalec, glasbenik ali organizator. Administratorja dodeli samo obstoječi admin. Ali to zgradimo sami (e-naslov, geslo, vloge) ali uporabimo Auth0 oziroma Firebase?

## Obravnavane alternative

* Lastna registracija in prijava (e-naslov, geslo, bcrypt, JWT)
* Auth0
* Firebase Authentication

## Odločitev

Izbrana alternativa: **lastna avtentikacija**, ker potrebujemo le e-naslov, geslo in nekaj vlog, projekt pa mora teči lokalno brez zunanjih računov in plačljivih načrtov.

## Posledice

### Pozitivne

* Vloge (`OBISKOVALEC`, `GLASBENIK`, `ORGANIZATOR`, `ADMIN`) so v naši bazi, enako kot ostali podatki.
* Za zagon ni potreben račun pri tretjem ponudniku.
* Za šolski obseg je tok registracije kratek in razumljiv.

### Negativne

* Sami skrbimo za shranjevanje gesel in obnovo, če jo dodamo.
* Nimamo pripravljenega »prijavi se z Google«.

## Prednosti in slabosti alternativ

### Lastna avtentikacija

* Dobro, ker je vse v projektu in se ujema z ER modelom.
* Slabo, ker varnost (hash, piškotek) pišemo sami.

### Auth0

* Dobro, ker so prijava, obnova gesla in socialni vstopi že narejeni.
* Slabo, ker za lokalni zagon rabiš zunanji račun in nastavitev tenanta.
* Slabo, ker je brezplačni načrt omejen.

### Firebase Authentication

* Dobro, ker prijavo dobiš v nekaj vrsticah.
* Slabo, ker nas veže na Firebase, vloge pa bi še vedno morali voditi pri sebi.
