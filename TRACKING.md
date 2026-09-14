# 📊 Sekimas — Microsoft Clarity + įvykių sluoksnis

Clarity projektas `yi612dyhxe`. Vienas failas [`track.js`](track.js) — visuose 17 HTML.
**Kam:** ar vaikai grįžta prie įrankių **namie**, kur stringa, ką spaudžia. Nieko daugiau.

## Privatumas (nekeičiama — naudotojai 6–8 m.)
Jokių vardų, įrenginio ID ar pastovių identifikatorių · `track.js` nieko nerašo į `localStorage` ir nededa sausainėlių · `clarity("identify")` **niekada** · testo „rašyk žodį" režime **įvestas tekstas nesiunčiamas** (tik ok/klaida) · Clarity pusėje **Balanced masking** (įvestys maskuojamos, klausimų tekstas matomas — kad įrašus būtų galima analizuoti).

## Automatinės seanso žymos (visur)
| Žyma | Reikšmės | Ką sako |
|---|---|---|
| `irankis` | `testas`·`deck`·`suvestine`·`scenarijus`·`miste-runner`·`klavisu-sokis`·`miste-statistika`·`hub`… | kuris įrankis |
| `kelias` | `p1/testas.html`… | pilnas kelias; šakniniai dublikatai = `hub-testas`/`hub-scenarijus` |
| **`kontekstas`** | `pamoka`·`namai` | **ar žaidžia namie.** `pamoka` = **Kt 12:45–14:25 · Pn 12:55–16:00** Europe/Vilnius (= Supabase `bcjr_tvarkarastis` langų aprėptis, įrašyta kietai — keičiant tvarkaraštį keisti abu) |
| `ivestis` | `touch`·`pele` | per pirmą sąlytį |
| `ekranas` | `tel`(<600px)·`plansete`(<1024)·`kompas` | |
| `saltinis` | `hub`·`tiesiogiai`·`vidinis`·domenas | iš kur atėjo |
| **`rezimas`** | `vaikas`·`dev` | `dev`, jei URL turi `sim`,`auto`,`nosend`,`send`,`ff`,`quiz`,`cap`,`read` arba `m=1` |
| `versija` | `p1-diag-v3`·`miste-2026-09-14`·`ks-2026-09-14` | puslapio versija |
| `grupe` | iš `?g=` | klasė (nustato mentorius) |
| `sesija` | UUID | **nesaugomas niekur**; tik sąsajai su Supabase |

> **Filtruok visada `rezimas = vaikas`** — iškrenta Kris'o ir Gabrieliaus bandymai. Hub'as (`infogynejai.lt`) žymi `rezimas=dev` tik su `?dev=1` — Kris/Gabrielius hub'ą atidaro su šiuo parametru.
> ⚠️ `kortele_click` / `nuoroda_click` šauna prieš pat pereinant į kitą domeną — dalis pradingsta. Patikimesnis hub'o signalas: `saltinis = hub` paskirties puslapyje.
> Namų signalas: **`kontekstas = namai`**.

## Įvykiai (⭐ = `upgrade`, Clarity rodo pirmiausia)
| Įvykis | Žymos | Ką sako |
|---|---|---|
| **p1/testas.html** | | |
| `testas_pradeta` · `testas_lytis` | — · `lytis` | startas · lyties klausimas |
| `testas_skaitymas_baigta` | `saka`(r/v), `skaitymo_balas` | apšilimas, parinkta šaka |
| `atsakymas_ok`/`atsakymas_klaida` | `klausimas`,`pakopa`,`sritis`,`dvejone_ms`(`<1s`·`1-3s`·`3-8s`·`>8s`),`faze` | **`<1s` = spėlioja** |
| `garsas_perskaityk` | `klausimas` | ar naudoja 🔊 |
| `pakartojimas_pradetas` · `laiko_riba` | — · `nutraukta_ties` | klaidų ratas · 11 min riba |
| `testas_baigta` ⭐ | `lygis_bendras`,`trukme_s`,`klaidu`,`saka`,`nebaigta` | pabaigė |
| `testas_nutrauktas` ⭐ | `nutraukta_ties`=`<klausimo id>\|<fazė>` | **kur pasitraukė nebaigęs** |
| `dar_karta` · `kitas_vaikas` | — | perkrovimo mygtukai |
| **zaidimai/miste-runner.html** | | |
| `zaidimas_pradeta` · `suolis` | `versija`,`rekordas` · `klavisas`(1–5) | suolių riba 200/bėgimą |
| `mirtis` | `taskai`,`laikas_s`,`klausimu` | kur baigėsi |
| `klausimas_ok`/`klausimas_klaida` | `klausimas` | viktorina |
| `garsas_perskaityk` · `garsas_auto` | `klausimas` · `ijungta` | ar naudoja balsą |
| `naujas_rekordas` ⭐ | `taskai`,`pirmas` | „parodyk draugui" momentas |
| `dar_karta` | — | |
| **zaidimai/klavisu-sokis.html** | | |
| `zaidimas_pradeta` · `zaidimas_baigta` | `versija` · `zvaigzdes`,`klaidu` | |
| `raunda_baigta` · `klaida` | `lygis`,`zvaigzdes`,`klaidu` · `klavisas`(**laukto** klavišo vardas),`lygis` | lygis · ne tas klavišas |
| `naujas_rekordas` ⭐ · `dar_karta` | `zvaigzdes`,`pirmas` · — | |
| **p1/deck.html** | `skaidre`(`nr`,`kryptis`) · `kalba` · `taimeris_startas` · `taimeris_reset` | pamokos eiga |
| **visi puslapiai** | `nuoroda_click`(`i`=href) | navigacija |

## Clarity įrašas ↔ Supabase eilutė
`sesija` rašoma ir kaip Clarity žyma, ir į eilutę kaip `clarity_sesija`
(`bcjr_testas`, `bcjr_miste`). **Susiejimas:** paimk `clarity_sesija` iš Supabase →
Clarity → Recordings → filtras `sesija = <ta reikšmė>` → tas pats vaikas, kuris davė tuos skaičius.

## Pastabos
`p1/testas-vaizdinis.html` — 0 s peradresavimas į `testas.html?v=1`, tad jo `irankis` beveik nespėja užsiregistruoti; vaizdinę šaką matuok per `saka=v`. · `track.js` niekada nemeta klaidos: neužsikrovus Clarity, `ig.ev/tag/upgrade` tyliai nieko nedaro.
