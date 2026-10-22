# Funkcionalnosti in obseg

## Uporabniške vloge

### 1. Obiskovalec

Uporabnik, ki ga zanimajo koncerti. Del vsebine lahko vidi brez prijave, za sledenje in označevanje udeležbe pa potrebuje račun.

**Lahko:**
- brska po javnem koledarju koncertov in ga filtrira po mestu, žanru in datumu,
- pregleduje javne profile bendov in prizorišč,
- ko je prijavljen, sledi bendom in prizoriščem ter dobiva obvestila o njihovih novih koncertih,
- ko je prijavljen, pri koncertu označi „Grem“.

**Ne more:**
- videti razpisanih terminov, ki še niso objavljeni kot koncerti, niti prijav nanje,
- ustvariti profila benda ali prizorišča, objavljati terminov ali se nanje prijavljati,
- ocenjevati bendov ali prizorišč,
- videti kontaktnih podatkov organizatorjev in bendov.

### 2. Glasbenik (član benda)

Registriran uporabnik, ki igra v enem ali več bendih. V vsakem bendu je **vodja** ali **član**.

**Lahko:**
- ustvari bend, s čimer postane njegov vodja, in povabi druge glasbenike,
- ureja profil benda (žanri, opis, povezave do posnetkov, tehnične zahteve), če je vodja,
- išče razpisane termine in pri njih vidi kontakt prizorišča, če želi organizatorja kaj vprašati,
- če je vodja, v imenu benda odda prijavo, jo umakne, dokler organizator o njej še ni odločil, ali odpove že sprejet nastop,
- spremlja, v kakšnem stanju so prijave njegovih bendov,
- po izvedenem koncertu oceni prizorišče.

**Ne more:**
- oddati, umakniti ali odpovedati prijave, če ni vodja benda,
- urejati bendov, v katerih ni član,
- videti prijav drugih bendov na isti termin,
- objavljati terminov ali upravljati prizorišč,
- odstraniti vodje ali izbrisati benda, če sam ni vodja.

### 3. Organizator (predstavnik prizorišča)

Registriran uporabnik, ki upravlja eno ali več prizorišč.

**Lahko:**
- ustvari in ureja profil prizorišča (naslov, kapaciteta, oprema, fotografije, kontaktni telefon in e-naslov),
- objavi razpisan termin z datumom, žanri, številom mest v zasedbi, pogoji plačila in rokom za prijave,
- pregleduje vse prijave na svoje termine, pri vsaki vidi kontakt vodje benda, jih uvršča v ožji izbor ter sprejema ali zavrača,
- določi vrstni red nastopov in potek večera (soundcheck, začetki setov),
- objavi koncert ali ga odpove,
- po izvedenem koncertu oceni bende, ki so nastopili.

**Ne more:**
- videti ali urejati terminov in prijav drugih prizorišč,
- prijavljati se na termine, razen če ima poleg tega tudi račun glasbenika,
- urejati profilov bendov.

### 4. Administrator

Skrbi za delovanje platforme in za to, da vsebina ostane primerna.

**Lahko:**
- pregleduje uporabniške račune in jim spreminja vlogo,
- skrije neprimerne profile bendov, prizorišč in ocene,
- ureja seznam žanrov,
- pregleduje osnovno statistiko platforme.

**Ne more:**
- oddajati prijav v imenu bendov ali sprejemati prijav v imenu prizorišč,
- spreminjati ocen, ki so jih napisali uporabniki (lahko jih le skrije),
- videti gesel uporabnikov, saj so shranjena samo v zgoščeni obliki.

## Predvidene funkcionalnosti

| # | Funkcionalnost | Opis | MVP |
|---|----------------|------|:---:|
| F1 | Sestava benda | Glasbenik ustvari bend in vanj povabi ostale člane. En glasbenik lahko igra v več bendih. | **MVP** |
| F2 | Razpis termina | Organizator objavi prost večer: datum, žanr, koliko bendov išče, plačilo in rok za prijave. Glasbeniki pri terminu vidijo kontakt prizorišča. | **MVP** |
| F3 | Iskanje terminov po žanru | Bend išče odprte termine po mestu in datumu. Termini, ki se ujemajo z žanrom benda, so prikazani višje. | **MVP** |
| F4 | Prijava s preverjanjem konfliktov | Vodja benda prijavi bend na termin. Sistem preveri, ali kateri od članov isti dan že nastopa drugje, tudi z drugim bendom. | **MVP** |
| F5 | Izbor zasedbe | Organizator primerja prijave in izbere bende. Ko je zasedba polna, se ostale prijave samodejno zavrnejo. | **MVP** |
| F6 | Objava koncerta v koledarju | Ko je zasedba potrjena, se termin samodejno objavi kot koncert v javnem koledarju. | **MVP** |
| F7 | Potek večera | Organizator določi vrstni red nastopov in čase setov, bendi pa to vidijo pri svojem nastopu. | |
| F8 | Odpoved nastopa | Če bend odpove, se njegovo mesto znova odpre, bendi iz ožjega izbora pa dobijo obvestilo. | |
| F9 | Nerazpoložljivost članov | Glasbenik vpiše dneve, ko ne more igrati, sistem pa jih upošteva pri prijavah. | |
| F10 | Sledenje in udeležba | Obiskovalec sledi bendom in prizoriščem ter pri koncertu označi „Grem“. | |
| F11 | Obvestila | Uporabnik dobi obvestilo o novi prijavi, odločitvi organizatorja, povabilu v bend ali novem koncertu. | |
| F12 | Ocene po koncertu | Po koncertu se bend in prizorišče med seboj ocenita. | |
| F13 | Statistika prizorišča | Organizator vidi, koliko prijav dobi, koliko terminov zapolni in koliko ljudi pride. | |

### Funkcionalnosti MVP

Prva delujoča različica vsebuje funkcionalnosti od F1 do F6. Štiri od njih so značilne prav za to rešitev:

- **F3**: iskanje terminov glede na žanr benda,
- **F4**: preverjanje, ali kateri od članov isti dan že nastopa drugje,
- **F5**: samodejno zapiranje termina, ko je zasedba polna,
- **F6**: samodejna objava koncerta.

### Glavni delovni proces: od razpisa do koncerta

1. Organizator razpiše termin, ki je odprt za prijave.
2. Bendi se prijavijo, organizator pa izbrane uvrsti v ožji izbor.
3. Ko organizator sprejme dovolj bendov ali poteče rok, se termin zapre.
4. Organizator potrdi zasedbo in termin postane javni koncert.
5. Po datumu koncerta ga sistem označi kot izvedenega.

Če bend pred koncertom odpove, se termin znova odpre za prijave (F8). Organizator lahko termin kadar koli pred koncertom odpove.

Pravila, ki jih sistem upošteva:

- Prijavo lahko odda, umakne ali odpove samo vodja benda.
- Bend se na posamezen termin lahko prijavi samo enkrat, in to le, dokler je termin odprt in rok za prijave še ni potekel.
- Prijava ni mogoča, če ima kateri koli član benda na isti dan že sprejeto prijavo, ne glede na to, s katerim bendom.
- Sprejetih prijav ne more biti več, kot je mest v zasedbi. Ko se zasedba zapolni, se termin zapre, ostale odprte prijave pa se zavrnejo.
- Koncert je mogoče objaviti le, če ima vsaj eno sprejeto prijavo.

## Kasnejše nadgradnje

1. **E-poštna obvestila** in tedenski povzetek novih terminov, ki ustrezajo žanrom benda.
2. **Izvoz v koledar (iCal)**, da si bend ali obiskovalec koncert doda v Google ali Apple koledar.
3. **Zemljevid prizorišč in koncertov** (na primer z Leaflet in OpenStreetMap) ter iskanje po oddaljenosti.
4. **Vgrajeni predvajalniki** Spotify, YouTube ali Bandcamp na profilu benda.
5. **Priporočila za organizatorje**, ki predlagajo bende glede na žanr, ocene in pretekle nastope.
6. **Sporočila med bendom in organizatorjem** znotraj posamezne prijave.
7. **Predlogi prijav**, pri katerih član benda predlaga prijavo na termin, vodja pa jo potrdi ali zavrne.

## Izven obsega (out of scope)

- Prodaja vstopnic in spletna plačila (honorarji, vstopnine, provizije).
- Sklepanje pravno zavezujočih pogodb in izdajanje računov.
- Nalaganje in predvajanje glasbenih datotek. Platforma hrani samo povezave do zunanjih storitev.
- Upravljanje avtorskih pravic in poročanje organizacijam, kot je SAZAS.
- Izposoja tehnične opreme ali ozvočenja med uporabniki.
- Nativni mobilni aplikaciji za iOS in Android.
- GigSpot ni splošno družbeno omrežje, zato ne bo imel objav, zidov ali komentarjev, ki niso povezani s koncerti.
