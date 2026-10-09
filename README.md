# Képgaléria – jegyzet

Az egész lényege, hogy van egy képlista, és mindig az egyik képet nézem nagyban. Alatta ott vannak a kis képek. Rákattintok valamelyikre, vagy lapozok a nyilakkal, és megváltozik az aktuális kép.

A képek adatai az `adat.tsx` fájlban vannak. A Context azt tartja számon, melyik képnél járok. A komponensek meg ebből összerakják a felületet.

## adat.tsx – itt vannak a képek adatai

```ts
export interface KepAdat {
    id: number
    cim: string
    utvonal: string
}
```

Ez leírja, milyen adat kell egy képhez. Az `id` az azonosító, a `cim` a kép neve, az `utvonal` pedig az, ahonnan be kell tölteni.

A `KEPEK` egy ilyen adatokból álló tömb:

```ts
export const KEPEK: KepAdat[] = [
    {
        id: 1,
        cim: "Michael Jordan",
        utvonal: `${import.meta.env.BASE_URL}kepek/crying_jordan.jpg`
    },
    // Itt jön a többi kép.
]
```

A `KepAdat[]` azt jelenti, hogy a tömb elemeinek ezt az interfészt kell követniük. Ha elírok egy mezőt, vagy rossz típust adok meg, a TypeScript szól.

A képfájlok a `public/kepek` mappában vannak. A böngészőben az útvonalból kimarad a `public`. Az `import.meta.env.BASE_URL` a Vite-ban beállított alapútvonalat adja, nálam `/KepGaleryContext/`. Ehhez kerül hozzá a `kepek/...`, így GitHub Pagesen is a projekt mappájából tölti be a képet.

Fontos: a képek listája itt sima adat, nem React-állapot. Nem változtatom meg a képeket, csak azt, hogy melyik van kiválasztva.

## KepContext.tsx – a közös cucc

```ts
interface KepKontextusErtek {
    aktualis: number
    valaszt: (sorszam: number) => void
    lapoz: (elore: boolean) => void
}
```

A Context három dolgot ad:
- `aktualis`: a kiválasztott kép tömbbeli indexe;
- `valaszt`: kiválaszt egy képet;
- `lapoz`: előre vagy hátra lép.

A `void` azt jelenti a függvények végén, hogy nincs visszaadott eredményük, csak állapotot módosítanak.

```ts
export const KepContext =
    createContext<KepKontextusErtek | undefined>(undefined)
```

Ezzel létrejön a Context. Provider nélkül `undefined` lenne az értéke, mert nincs honnan megkapnia az adatokat.

## KepProvider – itt van az állapot

```ts
const [aktualis, setAktualis] = useState<number>(0)
```

Kezdetben a nulladik képet mutatja. A tömb indexelése nullától indul, tehát ez az első kép.

Az `aktualis` nem ugyanaz, mint a kép `id` értéke. Az első képnél az id 1, az index viszont 0. Ezt nem érdemes összekeverni, mert akkor rögtön rossz képet kérnék ki.

A `setAktualis` módosítja az állapotot. Ettől a Contextet olvasó komponensek az új érték alapján jelennek meg.

A Provider `children` paramétere `ReactNode` típusú. Ez az a tartalom, amit a Provider két tagje közé rakok, jelen esetben az App.

## valaszt – kattintás a kis képre

```ts
const valaszt = (sorszam: number) => {
    setAktualis(sorszam)
}
```

Megkapja a kép indexét, aztán ezt beállítja aktuálisnak. Ennyi, nincs túlbonyolítva.

A galéria a `map` során létrejövő indexet adja át, ezért normál kattintáskor létező képet választok ki. Maga ez a függvény külön nem ellenőrzi, hogy jó-e a sorszám.

## lapoz – a nyilak működése

```ts
const lapoz = (elore: boolean) => {
    const darab = KEPEK.length
    if (darab === 0) return

    setAktualis(elozo => {
        const lepes = elore ? 1 : -1
        return (elozo + lepes + darab) % darab
    })
}
```

A `KEPEK.length` megmondja, hány kép van. Ha nulla, kilép, mert nulla képen nincs mit lapozni.

Az `elore` igaz vagy hamis:
- `true`: következő kép, vagyis +1;
- `false`: előző kép, vagyis -1.

Az `elozo` itt az állapot előző indexe. A `setAktualis` függvénynek most egy függvényt adok, így a React a friss előző állapotból számol.

A képlet elsőre kicsit kusza:

```ts
(elozo + lepes + darab) % darab
```

A `%` az osztási maradék. Ettől körbeér a lapozás. Három képnél, ha a 2-es indexről előre lépek:

```ts
(2 + 1 + 3) % 3 = 0
```

Visszakerülök az első képre.

Ha a nulladik képről hátra lépek:

```ts
(0 - 1 + 3) % 3 = 2
```

Az utolsó képet kapom. A hozzáadott `darab` azért kell, hogy a visszafelé lépésnél ne negatív index legyen.

## A Provider továbbadja az adatokat

```tsx
<KepContext.Provider value={{ aktualis, valaszt, lapoz }}>
    {children}
</KepContext.Provider>
```

A `value` objektumban vannak az adatok és függvények, amiket a belül lévő komponensek elkérhetnek.

Az Appot ezért a Provider belsejébe kell rakni. Ha kívül van, ez az egész nem fogja megkapni a közös adatokat.

## useKepKontextus – a saját hook

```ts
export function useKepKontextus() {
    const kontextus = useContext(KepContext)

    if (kontextus === undefined) {
        throw new Error('A KepContext nem érhető el')
    }

    return kontextus
}
```

Ez kiolvassa a Contextet. Ha nincs Provider, hibát dob. Egyébként visszaadja az `aktualis`, `valaszt` és `lapoz` értékeket.

A komponensben csak azt kérem el, amire szükségem van:

```ts
const { lapoz } = useKepKontextus()
```

A kapcsos zárójel kiszedi a `lapoz` függvényt a visszakapott objektumból.

## App.tsx – összerakja a felületet

```ts
const { aktualis } = useKepKontextus()
```

Az App a Contextből megkapja az aktuális indexet. A képlista viszont közvetlenül az `adat.tsx` fájlból jön, importtal.

```tsx
<NagyKep kep={KEPEK[aktualis]} />
<Galeria kepek={KEPEK} aktualis={aktualis} />
```

A `KEPEK[aktualis]` kiválasztja az aktuális kép teljes adatobjektumát. Ezt kapja meg a NagyKep.

A Galeria megkapja az egész listát és az aktuális indexet, hogy tudja, melyik kis képet kell kijelölni.

Itt tehát a Context és a props együtt működik. Nem muszáj mindent ugyanonnan elkérni:
- az aktuális index és a műveletek a Contextben vannak;
- a megjelenítendő képadatok propsként mennek tovább.

## Galeria.tsx – végigmegy a képlistán

```tsx
{kepek.map((elem, sorszam) => (
    <KisKep
        kep={elem}
        sorszam={sorszam}
        key={elem.id}
        kivalasztott={sorszam === aktualis}
    />
))}
```

A `map` minden képhez létrehoz egy KisKep komponenst.

Az `elem` a kép adatobjektuma, a `sorszam` a tömbbeli indexe. A `kivalasztott` akkor igaz, ha ez a kép az aktuális.

A `key={elem.id}` a Reactnek kell az elemek azonosításához. A key külön dolog, azt a KisKep nem kapja meg sima propsként.

## Kiskep.tsx – kattintható kis kép

```ts
const { valaszt } = useKepKontextus()
```

A kattintási függvényt közvetlenül a Contextből veszi. A kép adatai, a sorszám és a kiválasztottság a Galeriától jönnek propsként.

```tsx
className={`kepdiv ${kivalasztott ? 'aktiv' : ''}`}
onClick={() => valaszt(sorszam)}
```

A `kepdiv` osztály mindig rajta van. Ha kiválasztott a kép, akkor megkapja mellé az `aktiv` osztályt is. Ebből tudja a CSS, melyiknek kell kék keret.

A nyílfüggvény miatt a `valaszt` csak kattintáskor fut le. Ha így írnám:

```tsx
onClick={valaszt(sorszam)}
```

akkor már megjelenítés közben meghívná. Az úgy elég hülyén működne.

## NagyKep.tsx – a nagy kép és a nyilak

```tsx
<button onClick={() => lapoz(false)}>◀</button>
<button onClick={() => lapoz(true)}>▶</button>
```

Ez rövidített részlet: a tényleges gombokon osztály, típus és akadálymentes név is van.

A bal nyíl hamisat ad át, a jobb igazat. A Context `lapoz` függvénye intézi, melyik index legyen belőle.

```tsx
<img src={kep.utvonal} alt={kep.cim || 'Kép'} />
<p>{kep.cim}</p>
```

