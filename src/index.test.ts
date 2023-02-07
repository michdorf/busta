import Ricorrente from 'moduli/moduli/ricorrente';
import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

describe('test Ricorrente', () => {
	it('can repeat each month', () => {
		let r = new Ricorrente('m',1,new Date(2023,0,4));
		expect(Ricorrente.prossima(r, new Date(2023,1,1))).toBe(new Date(2023,2,4));
	})
})

describe('test Ricorrente', () => {
    it('can find the previous date', () => {
        let r = new Ricorrente('m',1,new Date(2023,2,4));
        expect(Ricorrente.scorsa(r)).toBe(new Date(2023,2,4));
    })
})
