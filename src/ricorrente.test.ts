import Ricorrente from '../moduli/moduli/ricorrente';
import { describe, it, expect } from 'vitest';

/* NB. puo ritornare la data corrente, se e' una data coretto */
/* Obs. non ritorna date prima del primoGiorno - penso */


describe('test Ricorrente in mesi', () => {
    it('can find the previous date', () => {
        let r = new Ricorrente('m',1,new Date(2023,2,4));
        expect(Ricorrente.scorsa(r, new Date(2023,0,4))).toStrictEqual(new Date(2023,0,4));
    })

	it('can repeat each month', () => {
		let r = new Ricorrente('m',1,new Date(2023,0,4));
		expect(Ricorrente.prossima(r, new Date(2023,1,4))).toStrictEqual(new Date(2023,2,4));
	})

    it('can repeat each month - previous date', () => {
        let r = new Ricorrente('m',1,new Date(2023,0,4));
        expect(Ricorrente.prossima(r, new Date(2023,2,2))).toStrictEqual(new Date(2023,2,4));
    })

    it('can repeat each month - later date', () => {
        let r = new Ricorrente('m',1,new Date(2023,0,4));
        expect(Ricorrente.prossima(r, new Date(2023,2,12))).toStrictEqual(new Date(2023,3,4));
    })
})

describe('test Ricorrente in anni', () => {
    it('can find the previous date', () => {
        let r = new Ricorrente('a',1,new Date(2023,2,4));
        expect(Ricorrente.scorsa(r, new Date(2023,4,5))).toStrictEqual(new Date(2023,2,4));
    })

    it('can repeat each year - earlier date in month', () => {
		let r = new Ricorrente('a',1,new Date(2022,11,7));
		expect(Ricorrente.prossima(r, new Date(2023,2,1))).toStrictEqual(new Date(2023,11,7));
	})

    it('can find the previous date same date', () => {
        let r = new Ricorrente('a',1,new Date(2023,2,4));
        expect(Ricorrente.scorsa(r, new Date(2023,2,4))).toStrictEqual(new Date(2023,2,4));
    })

	it('can repeat each year', () => {
		let r = new Ricorrente('a',1,new Date(2023,0,4));
		expect(Ricorrente.prossima(r, new Date(2024,1,2))).toStrictEqual(new Date(2025,0,4));
	})

    it('can have a primo giorno in futuro', () => {
        let r = new Ricorrente('a',1,new Date(2024,2,4));
        expect(Ricorrente.prossima(r, new Date(2023,0,5))).toStrictEqual(new Date(2024,2,4));
    })

    it('can repeat 3rd year', () => {
        let r = new Ricorrente('a',3,new Date(2023,0,4));
        expect(Ricorrente.prossima(r, new Date(2023,1,2))).toStrictEqual(new Date(2026,0,4));
    })

	it('can repeat 3rd year - previous date', () => {
		let r = new Ricorrente('a',3,new Date(2023,0,4));
		expect(Ricorrente.prossima(r, new Date(2023,0,2))).toStrictEqual(new Date(2023,0,4));
	})
});

describe('test periodi', () => {
    it('can find a period', () => {
		let r = new Ricorrente('a',1,new Date(2023,0,1));
		expect(Ricorrente.prossima(r, new Date(2023,1,15))).toStrictEqual(new Date(2024,0,1));
        expect(Ricorrente.scorsa(r, new Date(2023,1,15))).toStrictEqual(new Date(2023,0,1));
	})
});