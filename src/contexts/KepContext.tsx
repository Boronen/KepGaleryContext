import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { KEPEK } from "../adat";

interface KepKontextusErtek {
    aktualis: number
    valaszt: (sorszam: number) => void
    lapoz: (elore: boolean) => void
}

export const KepContext = createContext<KepKontextusErtek | undefined>(undefined)

interface KepProviderProps {
    children: ReactNode
}

export function KepProvider({ children }: KepProviderProps) {
    const [aktualis, setAktualis] = useState<number>(0)

    const valaszt = (sorszam: number) => {
        setAktualis(sorszam)
    }

    const lapoz = (elore: boolean) => {
        const darab = KEPEK.length
        if (darab === 0) return

        setAktualis(elozo => {
            const lepes = elore ? 1 : -1
            return (elozo + lepes + darab) % darab
        })
    }

    return (
        <KepContext.Provider value={{ aktualis, valaszt, lapoz }}>
            {children}
        </KepContext.Provider>
    )
}

export function useKepKontextus() {
    const kontextus = useContext(KepContext)

    if (kontextus === undefined) {
        throw new Error('A KepContext nem érhető el')
    }

    return kontextus
}
