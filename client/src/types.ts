export namespace CurrencyRatesComponent {
    export interface Currency {
        name: string;
        value: number;
    }
    
    export interface Props {
        currencyFrom: Currency;
        currencyToName: string;
    }

    export interface State {
        currencyNames: string[];
    }
}

export namespace SmartInputComponent {
    export interface Props {
        values: string[];
        limit: number;
    }

    export interface State {
        input: string;
        possibleValues: string[];
    }
}