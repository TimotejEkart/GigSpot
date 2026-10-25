# JWT v httpOnly piškotku

* Status: sprejeto
* Datum: 2026-10-24

## Kontekst in problem

Uporabnik se prijavi z e-naslovom in geslom. Strežnik mora vedeti, kdo je, pri naslednjih zahtevah. Žeton lahko damo v `localStorage`, v piškotek, ki ga vidi JavaScript, ali v httpOnly piškotek. Izbira vpliva na to, ali ga lahko ukrade XSS.

## Obravnavane alternative

* JWT v `localStorage`
* JWT v httpOnly piškotku
* Seje na strežniku (npr. Redis)

## Odločitev

Izbrana alternativa: **JWT v httpOnly piškotku**, ker JavaScript do žetona ne more, strežniku pa ni treba hraniti sej. To je dovolj za šolski MVP in se ujema z lastno avtentikacijo (ADR 0006).

## Posledice

### Pozitivne

* XSS ne more prebrati žetona iz `localStorage`.
* Backend ostane brez stanja: žeton se preveri ob vsaki zahtevi.
* Frontend žetona ne nastavlja ročno, brskalnik ga pošlje sam.

### Negativne

* Treba je pravilno nastaviti `Secure`, `SameSite` in CORS, ker sta frontend in backend na različnih vratih.
* Odjava pomeni brisanje piškotka, ne samo čiščenje pomnilnika v brskalniku.

## Prednosti in slabosti alternativ

### JWT v localStorage

* Dobro, ker je implementacija najpreprostejša.
* Slabo, ker vsak skript na strani vidi žeton.
* Slabo, ker moraš žeton ročno dodati v vsak zahtevek.

### JWT v httpOnly piškotku

* Dobro, ker žeton ni dosegljiv iz JavaScripta.
* Slabo, ker je nastavitev piškotka med `localhost:5173` in `localhost:3000` malo več dela.

### Seje na strežniku

* Dobro, ker lahko sejo takoj prekličeš, npr. ob odjavi na vseh napravah.
* Slabo, ker potrebuješ shrambo sej in backend ni več brez stanja.
