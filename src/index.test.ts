import Ricorrente from '$lib/ricorrente';
import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

describe('test Ricorrente in mesi', () => {
	it('can repeat each month', () => {
		let r = new Ricorrente('m',1,new Date(2023,0,4));
		expect(Ricorrente.prossima(r, new Date(2023,1,1))).toStrictEqual(new Date(2023,2,4));
	})
})

describe('test Ricorrente in anni', () => {
    it('can find the previous date', () => {
        let r = new Ricorrente('m',1,new Date(2023,2,4));
        expect(Ricorrente.scorsa(r)).toStrictEqual(new Date(2023,2,4));
    })

	it('can repeat each year', () => {
		let r = new Ricorrente('a',1,new Date(2023,0,4));
		expect(Ricorrente.prossima(r, new Date(2023,1,2))).toStrictEqual(new Date(2024,0,4));
	})

	it('can repeat 3rd year', () => {
		let r = new Ricorrente('a',3,new Date(2023,0,4));
		expect(Ricorrente.prossima(r, new Date(2023,1,2))).toStrictEqual(new Date(2026,0,4));
	})
})
