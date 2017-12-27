export class Convertor {

    private list: CurrencyEquivalent[];
    private from: Currency;
    private to: string;
    private shorthands: Shorthand[] = [
        {name: 'Orb of Alteration', shorthands: ['alt', 'alts', 'alteration']},
        {name: 'Orb of Fusing', shorthands: ['fus', 'fuse', 'fusing', 'fusings']},
        {name: 'Orb of Alchemy', shorthands: ['alc', 'alch', 'alchemy']},
        {name: 'Chaos Orb', shorthands: ['chaos']},
        {name: 'Gemcutter\'s Prism', shorthands: ['gcp', 'gemc']},
        {name: 'Exalted Orb', shorthands: ['ex', 'exe', 'exa', 'exalt', 'exalts', 'exalted']},
        {name: 'Chromatic Orb', shorthands: ['chrom', 'chrome', 'chromes', 'chromatic', 'chromatics']},
        {name: 'Jeweller\'s Orb', shorthands: ['jew', 'jewel', 'jeweller', 'jewellers']},
        {name: 'Orb of Chance', shorthands: ['chance', 'chanc']},
        {name: 'Cartographer\'s Chisel', shorthands: ['chis', 'chisel', 'chisels', 'cart']},
        {name: 'Orb of Scouring', shorthands: ['scour', 'scouring']},
        {name: 'Blessed Orb', shorthands: ['blessed', 'bless', 'bles']},
        {name: 'Orb of Regret', shorthands: ['regret', 'regrets']},
        {name: 'Regal Orb', shorthands: ['regal', 'rega']},
        {name: 'Divine Orb', shorthands: ['div', 'divine']},
        {name: 'Vaal Orb', shorthands: ['vaal']},
    ];
    private decimalPrecision: number;

    constructor (list: CurrencyEquivalent[], from: Currency, to: string, decimalPrecision: number = 2) {
        this.list = list;
        this.from = from;
        this.to = to;
        this.decimalPrecision = decimalPrecision;
    }

    public convert(): Currency {
        const fromName = this.findNameFromShorthand(this.from.name);
        const toName = this.findNameFromShorthand(this.to);
        const fromCurrency: CurrencyEquivalent = this.findCurrencyByName(fromName);
        const toCurrency: CurrencyEquivalent = this.findCurrencyByName(toName);
        if (!fromCurrency.chaosEquivalent || !toCurrency.chaosEquivalent) {
            let errorMessage = 'Cannot convert currencies. One or both of them don\'t have chaosEquivalent';
            errorMessage += '. Probably they are too rare.';
            throw new Error(errorMessage);
        }
        let value = this.from.value * fromCurrency.chaosEquivalent / toCurrency.chaosEquivalent;
        value = Math.round(value * (10 ** this.decimalPrecision)) / (10 ** this.decimalPrecision);
        return {
            name: toName,
            value
        };
    }

    private findNameFromShorthand(possibleShorthand: string): string {
        const foundedCurrency = this.shorthands.find((currency: Shorthand) => {
            return currency.shorthands.includes(possibleShorthand);
        });
        if (foundedCurrency) {
            return foundedCurrency.name;
        }
        return possibleShorthand;
    }

    private findCurrencyByName(name: string): CurrencyEquivalent {
        if (name === 'Chaos Orb') {
            return {
                name: 'Chaos Orb',
                chaosEquivalent: 1
            };
        }
        const foundedCurrency = this.list.find((currency: CurrencyEquivalent) => {
            return currency.name === name;
        });
        if (!foundedCurrency) {
            throw new Error(`Cannot find currency with name: ${name}`);
        }
        return foundedCurrency;
    }
}
