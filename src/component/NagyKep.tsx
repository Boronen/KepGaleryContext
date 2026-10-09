import type { KepAdat } from "../adat";
import { useKepKontextus } from "../contexts/KepContext";

interface NagyKepProps {
    kep: KepAdat
}

function NagyKep({ kep }: NagyKepProps) {
    const { lapoz } = useKepKontextus()

    return (
        <div className="nagykepdiv">
            <button className="elozo" onClick={() => lapoz(false)} aria-label="Előző kép"
                type="button">◀</button>
            <div>
                <div className="kep">
                    <img src={kep.utvonal} alt={kep.cim || 'Kép'} />
                </div>
                <p>{kep.cim}</p>
            </div>
            <button className="kovetkezo" onClick={() => lapoz(true)} aria-label="Következő kép"
                type="button">▶</button>
        </div>
    )
}

export default NagyKep
