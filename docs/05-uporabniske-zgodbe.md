# Uporabniške zgodbe

## US-01: Ustvarjanje benda in povabilo članov

- **Funkcionalnost:** F1 Sestava benda
- **Vloga:** glasbenik
- **MVP:** da

**Zgodba:** Kot glasbenik želim ustvariti bend in vanj povabiti ostale člane, da lahko skupaj iščemo nastope in se nanje prijavljamo.

**Acceptance criteria:**

1. Bend se shrani šele, ko glasbenik vnese ime, mesto in vsaj en žanr. Če kaj manjka, se bend ne shrani, pri praznem polju pa se prikaže sporočilo, kaj je treba izpolniti.
2. Glasbenik, ki bend ustvari, postane njegov vodja (`VODJA`).
3. Vodja povabi člana z vnosom e-maila. Če uporabnik s tem e-mailom ne obstaja ali nima vloge glasbenik, se prikaže sporočilo „Glasbenik s tem e-mail ne obstaja“.
4. Povabljeni ima status `POVABLJEN`. Ko povabilo sprejme, dobi status `AKTIVEN`, če ga zavrne, se povabilo izbriše.
5. Glasbenik je lahko hkrati aktiven član več bendov.

---



## US-02: Razpis termina

- **Funkcionalnost:** F2 Razpis termina
- **Vloga:** organizator
- **MVP:** da

**Zgodba:** Kot organizator želim na svojem prizorišču razpisati prost večer, da se nanj lahko prijavijo bendi, ki jih zanima nastop.

**Acceptance criteria:**

1. Obrazec zahteva datum, vsaj en žanr, število bendov (od 1 do 6), način plačila in rok za prijave. Brez teh podatkov se termin ne shrani.
2. Datum koncerta mora biti v prihodnosti, rok za prijave pa pred datumom koncerta. Sicer se prikaže napaka in termin se ne shrani.
3. Če je izbran način plačila `HONORAR`, je znesek obvezen.
4. Shranjen termin ima status `ODPRT` in se takoj prikaže glasbenikom pri iskanju terminov.
5. Pri terminu je prikazan kontakt prizorišča (telefon in e-mail), ampak samo prijavljenim glasbenikom in organizatorjem. Obiskovalci in neprijavljeni uporabniki ga ne vidijo.

---



## US-03: Iskanje odprtih terminov

- **Funkcionalnost:** F3 Iskanje terminov po žanru
- **Vloga:** vodja benda
- **MVP:** da

**Zgodba:** Kot vodja benda želim poiskati odprte termine v izbranem mestu in obdobju, da hitro najdem nastope, ki ustrezajo našemu bendu.

**Acceptance criteria:**

1. Seznam prikazuje samo termine s statusom `ODPRT`, ki jim rok za prijave še ni potekel.
2. Termine je mogoče filtrirati po mestu in obdobju (od, do).
3. Termini, ki imajo vsaj en žanr enak kot izbrani bend, so na vrhu seznama in označeni z „Ujema se z žanrom“.
4. Pri vsakem terminu so prikazani ime prizorišča, mesto, datum, žanri, število bendov, način plačila in rok za prijave.
5. Če noben termin ne ustreza filtrom, se prikaže sporočilo „Ni odprtih terminov za izbrane filtre“.

---



## US-04: Prijava benda na termin

- **Funkcionalnost:** F4 Prijava s preverjanjem konfliktov
- **Vloga:** vodja benda
- **MVP:** da

**Zgodba:** Kot vodja benda želim prijaviti bend na razpisan termin, da organizator ve, da bi radi nastopili.

**Acceptance criteria:**

1. Gumb „Prijavi bend“ vidi samo vodja benda. Ostali člani prijavo le vidijo.
2. Vodja lahko k prijavi doda sporočilo organizatorju, dolgo največ 500 znakov.
3. Oddana prijava ima status `ODDANA` in je vidna organizatorju ter vsem aktivnim članom benda.
4. Bend se na isti termin ne more prijaviti dvakrat. Ob drugem poskusu se prikaže sporočilo „Bend je na ta termin že prijavljen“.
5. Po poteku roka za prijave gumb ni več na voljo.

---



## US-05: Opozorilo na konflikt člana

- **Funkcionalnost:** F4 Prijava s preverjanjem konfliktov
- **Vloga:** vodja benda
- **MVP:** da

**Zgodba:** Kot vodja benda želim, da me sistem opozori, če kateri od članov na isti dan že nastopa drugje, da ne pride do dvojnega dogovora.

**Acceptance criteria:**

1. Pred oddajo prijave sistem preveri vse aktivne člane benda.
2. Če ima kateri od članov na isti datum že sprejeto prijavo (`SPREJETA`), s tem ali z drugim bendom, prijava ni mogoča.
3. Sporočilo pove, kateri član ima konflikt ter s katerim bendom in na katerem prizorišču že nastopa.
4. Prijave s statusom `ODDANA` ali `OZJI_IZBOR` ne štejejo kot konflikt, ker še niso potrjene.

---



## US-06: Izbor zasedbe

- **Funkcionalnost:** F5 Izbor zasedbe
- **Vloga:** organizator
- **MVP:** da

**Zgodba:** Kot organizator želim pregledati prijave na svoj termin ter jih sprejeti ali zavrniti, da sestavim zasedbo večera.

**Acceptance criteria:**

1. Organizator vidi prijave samo za termine svojih prizorišč. Pri vsaki prijavi vidi ime benda, žanre, sporočilo in kontakt vodje benda.
2. Prijavo lahko uvrsti v ožji izbor (`OZJI_IZBOR`), jo sprejme (`SPREJETA`) ali zavrne (`ZAVRNJENA`).
3. Sprejetih prijav ne more biti več, kot je število bendov na terminu.
4. Ko je sprejetih toliko prijav, kolikor je mest, se termin spremeni v `ZAPRT`, vse preostale prijave s statusom `ODDANA` ali `OZJI_IZBOR` pa v `ZAVRNJENA`.
5. Vodja in člani benda novo stanje prijave vidijo takoj, ko osvežijo stran.

---



## US-07: Objava koncerta

- **Funkcionalnost:** F6 Objava koncerta v koledarju
- **Vloga:** organizator
- **MVP:** da

**Zgodba:** Kot organizator želim potrditi zasedbo, da se koncert samodejno objavi v javnem koledarju in ga ni treba ročno objavljati drugje.

**Acceptance criteria:**

1. Gumb „Objavi koncert“ je na voljo samo, če ima termin vsaj eno sprejeto prijavo.
2. Po potrditvi se status termina spremeni v `OBJAVLJEN`.
3. Koncert se takoj prikaže v javnem koledarju z datumom, prizoriščem, naslovom in imeni sprejetih bendov.
4. Bendi, katerih prijave niso sprejete, v zasedbi niso prikazani.

---



## US-08: Brskanje po koledarju koncertov

- **Funkcionalnost:** F6 Objava koncerta v koledarju
- **Vloga:** obiskovalec
- **MVP:** da

**Zgodba:** Kot obiskovalec želim brskati po koledarju koncertov v svojem mestu, da najdem koncert, na katerega bi šel.

**Acceptance criteria:**

1. Koledar je dostopen tudi brez prijave.
2. V koledarju so samo koncerti s statusom `OBJAVLJEN`, katerih datum je danes ali kasneje.
3. Koncerte je mogoče filtrirati po mestu, žanru in mesecu.
4. Ob kliku na koncert se prikažejo prizorišče, naslov, datum, žanri in zasedba. Kontaktni podatki niso prikazani.

---



## US-09: Potek večera

- **Funkcionalnost:** F7 Potek večera
- **Vloga:** organizator
- **MVP:** ne

**Zgodba:** Kot organizator želim določiti vrstni red nastopov in začetke setov, da vsak bend ve, kdaj nastopa.

**Acceptance criteria:**

1. Potek večera je mogoče urediti samo za termine, ki imajo vsaj eno sprejeto prijavo.
2. Vsak sprejet bend dobi zaporedno številko nastopa in uro začetka seta. Dva benda ne moreta imeti iste zaporedne številke.
3. Ura začetka posameznega seta mora biti kasnejša od ure začetka prejšnjega seta.
4. Člani sprejetih bendov vidijo svojo zaporedno številko in uro pri prijavi, v javnem koledarju pa je zasedba prikazana po vrstnem redu.

---



## US-10: Odpoved nastopa

- **Funkcionalnost:** F8 Odpoved nastopa
- **Vloga:** vodja benda
- **MVP:** ne

**Zgodba:** Kot vodja benda želim odpovedati že sprejet nastop, da organizator pravočasno ve in lahko najde zamenjavo.

**Acceptance criteria:**

1. Odpoved je mogoča samo za prijave s statusom `SPREJETA` in samo pred datumom koncerta.
2. Razlog odpovedi je obvezen.
3. Po odpovedi ima prijava status `ODPOVEDANA`, termin pa se vrne v status `ODPRT`. Če je bil koncert že objavljen, se iz koledarja umakne, dokler organizator znova ne potrdi zasedbe.
4. Prijave, ki so bile v ožjem izboru in so bile ob zapolnitvi zasedbe samodejno zavrnjene, se vrnejo v status `OZJI_IZBOR`.

---



## US-11: Nerazpoložljivost člana

- **Funkcionalnost:** F9 Nerazpoložljivost članov
- **Vloga:** glasbenik
- **MVP:** ne

**Zgodba:** Kot glasbenik želim vpisati dneve, ko ne morem igrati, da me vodja benda ne prijavi na nastop, ki se ga ne morem udeležiti.

**Acceptance criteria:**

1. Glasbenik vpiše obdobje z datumom od in do. Datum do ne sme biti pred datumom od.
2. Glasbenik vidi seznam svojih vpisanih obdobij in jih lahko izbriše.
3. Če vodja prijavlja bend na termin, ki je v obdobju nerazpoložljivosti katerega od članov, se prikaže opozorilo z imenom tega člana.
4. Ostali člani vidijo samo, da je član tisti dan nerazpoložljiv, ne pa tudi razloga.

---



## US-12: Sledenje in udeležba

- **Funkcionalnost:** F10 Sledenje in udeležba
- **Vloga:** obiskovalec
- **MVP:** ne

**Zgodba:** Kot obiskovalec želim slediti bendom in prizoriščem ter označiti, da grem na koncert, da imam na enem mestu koncerte, ki me zanimajo.

**Acceptance criteria:**

1. Na profilu benda in prizorišča je gumb „Sledi“. Ponoven klik sledenje prekliče.
2. Pri objavljenem koncertu je gumb „Grem“. Ponoven klik oznako prekliče.
3. Obiskovalec na svojem profilu vidi seznam bendov in prizorišč, ki jim sledi, ter koncerte, ki jih je označil z „Grem“.
4. Organizator pri svojem koncertu vidi, koliko uporabnikov je označilo „Grem“.
5. Neprijavljen uporabnik je ob kliku na „Sledi“ ali „Grem“ preusmerjen na stran za prijavo.

---



## US-13: Obvestila o stanju prijave

- **Funkcionalnost:** F11 Obvestila
- **Vloga:** glasbenik
- **MVP:** ne

**Zgodba:** Kot glasbenik želim dobiti obvestilo, ko organizator spremeni stanje prijave mojega benda, da mi ni treba stalno preverjati prijav.

**Acceptance criteria:**

1. Ko se stanje prijave spremeni v `OZJI_IZBOR`, `SPREJETA` ali `ZAVRNJENA`, dobijo obvestilo vsi aktivni člani benda.
2. Organizator dobi obvestilo, ko na njegov termin prispe nova prijava.
3. V navigaciji je prikazano število neprebranih obvestil.
4. Klik na obvestilo ga označi kot prebrano in odpre prijavo, na katero se nanaša.

---



## US-14: Ocena po koncertu

- **Funkcionalnost:** F12 Ocene po koncertu
- **Vloga:** vodja benda
- **MVP:** ne

**Zgodba:** Kot vodja benda želim po koncertu oceniti prizorišče, da drugi bendi vedo, kakšne izkušnje imamo z njim.

**Acceptance criteria:**

1. Ocenjevanje je mogoče samo za termine s statusom `IZVEDEN` in samo za bende, ki so na tem terminu nastopili.
2. Ocena od 1 do 5 je obvezna, komentar pa je neobvezen in dolg največ 500 znakov.
3. Bend lahko prizorišče za posamezen koncert oceni samo enkrat.
4. Na profilu prizorišča je prikazana povprečna ocena, zaokrožena na eno decimalko, in število ocen.
5. Organizator lahko na enak način oceni bende, ki so nastopili na njegovem koncertu.

---



## US-15: Statistika prizorišča

- **Funkcionalnost:** F13 Statistika prizorišča
- **Vloga:** organizator
- **MVP:** ne

**Zgodba:** Kot organizator želim videti statistiko svojih terminov, da vem, kateri razpisi so uspešni in kaj bi lahko izboljšal.

**Acceptance criteria:**

1. Organizator vidi statistiko samo za svoja prizorišča.
2. Za izbrano obdobje je prikazano število razpisanih terminov in delež terminov, ki so bili zapolnjeni.
3. Prikazano je povprečno število prijav na termin in trije žanri, ki se največkrat prijavljajo.
4. Prikazano je skupno število oznak „Grem“ na objavljenih koncertih v izbranem obdobju.

