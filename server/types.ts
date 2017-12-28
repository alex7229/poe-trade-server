import * as express from 'express';
import { Db } from 'mongodb';
import { RequestResponse } from 'request';

export namespace Server {

    export interface CurrencyRequest extends express.RequestParamHandler {
        body: {
            from: Currency.Quantity;
            to: string;
        };
    }

    export interface AddFilterRequest extends express.RequestParamHandler {
        body: {
            filter: Filters.Filter;
        };
    }

    export interface ServerResponse extends express.Response {}
}

export namespace Currency {
    export interface Quantity {
        value: number;
        name: string;
    }

    export interface ChaosEquivalent {
        name: string;
        value: number | undefined;
    }

    export interface DatabaseList {
        updateTime: number;
        exchangeRates: ChaosEquivalent[];
    }

    export interface Shorthand {
        name: string;
        shorthands: string[];
    }
}

export namespace Filters {
    export interface FilterParameter {
        name: string;
        min: number;
        max: number;
    }

    export interface Filter {
        name: string;
        body: FilterParameter[];
    }
}

export namespace PoeNinjaInterface {
    export interface PayReceive {
        count: number;
        dataPointCount: number;
        getCurrencyId: number;
        id: number;
        includes_secondary: boolean;
        leagueId: number;
        payCurrencyId: number;
        sampleTimeUtc: string;
        value: number;
    }

    export interface CurrencyDetails {
        id: number;
        icon: string;
        name: string;
        poeTradeId: number;
    }

    export interface Lines {
        chaosEquivalent: number;
        currencyTypeName: string;
        pay: PayReceive;
        receive: PayReceive;
        paySparkLine: object[];
        receiveSparkLine: object[];
    }

    export interface Api {
        currencyDetails: CurrencyDetails[];
        lines: Lines[];
    }
}

export namespace Database {
    export interface ConnectionInfo {
        success: boolean;
        db: Db;
        error ?: Error;
    }

    export interface CrudResult {
        success: boolean;
        error ?: Error;
        data ?: {}[];
    }
}

export namespace RequestInterface {
    export interface Response {
        response: RequestResponse;
        success: boolean;
        error?: Error;
        body: string;
    }
}
