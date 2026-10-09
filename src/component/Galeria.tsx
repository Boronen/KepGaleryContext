import type { KepAdat } from "../adat";
import KisKep from "./Kiskep";

interface GaleriaProps {
    kepek: KepAdat[]
    aktualis: number
}

function Galeria({ kepek, aktualis }: GaleriaProps) {
    return (
        <div className="galeria">
            {kepek.map((elem, sorszam) => (
                <KisKep
                    kep={elem}
                    sorszam={sorszam}
                    key={elem.id}
                    kivalasztott={sorszam === aktualis}
                />
            ))}
        </div>
    )
}

export default Galeria
