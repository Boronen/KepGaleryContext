import type { KepAdat } from '../adat'
import { useKepKontextus } from '../contexts/KepContext'

interface KisKepProps {
    kep: KepAdat
    sorszam: number
    kivalasztott: boolean
}

function KisKep({ kep, sorszam, kivalasztott }: KisKepProps) {
    const { valaszt } = useKepKontextus()

    return (
        <div
            className={`kepdiv ${kivalasztott ? 'aktiv' : ''}`}
            onClick={() => valaszt(sorszam)}
        >
            <div className="kep">
                <img src={kep.utvonal} alt={kep.cim || 'Kép'} />
            </div>
        </div>
    )
}

export default KisKep
