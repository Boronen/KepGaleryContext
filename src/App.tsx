import { KEPEK } from './adat'
import './App.css'
import './Kep.css'

import NagyKep from './component/NagyKep'
import Galeria from './component/Galeria'
import { useKepKontextus } from './contexts/KepContext'

function App() {
  const { aktualis } = useKepKontextus()

  return (
    <>
      <header><h1>Képgaléria</h1></header>
      <main>
        <NagyKep kep={KEPEK[aktualis]} />
        <Galeria kepek={KEPEK} aktualis={aktualis} />
      </main>
      <footer>Kovács Kevin</footer>
    </>
  )
}

export default App
