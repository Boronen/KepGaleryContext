export interface KepAdat {
    id: number
    cim: string
    utvonal: string
}

export const KEPEK: KepAdat[] = [
    {
        id: 1,
        cim: "Michael Jordan",
        utvonal: `${import.meta.env.BASE_URL}kepek/crying_jordan.jpg`
    },
    {
        id: 2,
        cim: "White dude",
        utvonal: `${import.meta.env.BASE_URL}kepek/crying_white_dude.jpg`
    },
    {
        id: 3,
        cim: "Black Dude",
        utvonal: `${import.meta.env.BASE_URL}kepek/crying_black_dude.jpg`
    }
]
