// TODO: måske vil du kunne gentage "anden mandag i måneden"
type Intervallo = "g" | "s" | "m" | "a"; // Giorni, settimane, mese, anno

export default class Ricorrente {
    primoGiorno: Date = new Date();
    intervallo: Intervallo;
    intervalloN = 1;

    constructor(intervallo: Intervallo, intervalloN?: number, primoGiorno?: Date) {
        this.intervallo = intervallo || "m";
        if (typeof intervalloN !== "undefined") {
            this.intervalloN = parseInt(intervalloN as unknown as string);
        }
        if (typeof primoGiorno !== "undefined") {
            // Sørg for at primogiorno tæller fra midnat (minus klokkeslæt)
            this.primoGiorno = primoGiorno;
            this.primoGiorno.setHours(0,0,0,0);
        }
    }

    static scorsa(ricorrente: Ricorrente, offset?: Date): Date {
        const oggi = offset ? /*clone*/new Date(offset.getTime()) : new Date();
        const prossima = Ricorrente.prossima(ricorrente, offset);
        switch (ricorrente.intervallo) {
            case "g":
                prossima.setDate(prossima.getDate() - ricorrente.intervalloN);
                return prossima;
            case "s":
                prossima.setDate(prossima.getDate() - (ricorrente.intervalloN * 7));
                return prossima;
            case "m":
                prossima.setMonth(prossima.getMonth() - ricorrente.intervalloN);
                return prossima;
            case "a": // Non so come trattare skudår
                prossima.setFullYear(prossima.getFullYear() - ricorrente.intervalloN);
                return prossima;
        }
    }

    static prossima(ricorrente: Ricorrente, offset?: Date): Date {
        const oggi = offset ? /*clone*/new Date(offset.getTime()) : new Date();
        oggi.setHours(0,0,0,0);
        switch (ricorrente.intervallo) {
            case "g": {
                const giorni = Math.floor((oggi.getTime() - ricorrente.primoGiorno.getTime())/(1000*60*60*24));
                let giorniOffset = ricorrente.intervalloN-(giorni % ricorrente.intervalloN);
                if (giorniOffset === ricorrente.intervalloN) {giorniOffset = 0;}
                oggi.setDate(oggi.getDate() + giorniOffset);
                return oggi;
            }
            case "s":
                oggi.setDate(oggi.getDate() + (ricorrente.primoGiorno.getDay() + 7 - oggi.getDay()) % 7);
                return oggi;
            case "m": {
                debugger;
                let mesiDiff = (oggi.getMonth() - ricorrente.primoGiorno.getMonth());
                let diffAnni = oggi.getFullYear() - ricorrente.primoGiorno.getFullYear();
                if (mesiDiff < 0) {
                    diffAnni -= 1;
                    mesiDiff += 12;
                }
                mesiDiff += diffAnni * 12;
                let mesiOffset = ricorrente.intervalloN - (mesiDiff % ricorrente.intervalloN);
                /* if (mesiOffset === ricorrente.intervalloN) {
                    mesiOffset = 0
                } */
                oggi.setMonth(mesiOffset, ricorrente.primoGiorno.getDate());
                return oggi;
            }
            case "a": { // Non so come trattare skudår
                let oggiAnno = oggi.getFullYear();
                let diff = Math.abs(oggiAnno - ricorrente.primoGiorno.getFullYear());
                diff = diff % ricorrente.intervalloN;
                let anno = oggi.getFullYear() + diff;
                if (diff === 0) { // Check hvis det er senere på året dato og måned => skyd til næste gang i rækken
                    const oggiStamp = parseInt(oggi.getMonth()+""+oggi.getDate());
                    const primoGiornoStamp = parseInt(ricorrente.primoGiorno.getMonth()+""+ricorrente.primoGiorno.getDate())
                    if (oggiStamp > primoGiornoStamp) {
                        anno += ricorrente.intervalloN;
                    }
                }
                return new Date(anno, ricorrente.primoGiorno.getMonth(), ricorrente.primoGiorno.getDate());
            }
        }
    }
}
