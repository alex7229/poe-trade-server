interface Currency {
    value: number;
    name: string;
}

interface CurrencyEquivalent {
    name: string;
    chaosEquivalent: number | undefined;
}

interface CurrencyList {
    updateTime: number;
    exchangeRates: CurrencyEquivalent[];
}

interface Shorthand {
    name: string;
    shorthands: string[];
}

interface PayReceive {
    count: number;
    dataPointCount: number;
    getCurrencyId: number;
    id: number;
    leagueId: number;
    payCurrencyId: number;
    sampleTimeUtc: string;
    value: number;
}

interface CurrencyDetails {
    id: number;
    icon: string;
    name: string;
    poeTradeId: number;
    type: number;
    shorthands: string[];
}

interface Lines {
    chaosEquivalent: number;
    currencyTypeName: string;
    pay: PayReceive;
    receive: PayReceive;
    paySparkLine: object[];
    receiveSparkLine: object[];
}

interface PoeNinjaApiInterface {
    currencyDetails: CurrencyDetails[];
    lines: Lines[];
}