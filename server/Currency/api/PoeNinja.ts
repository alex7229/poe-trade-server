import { Request, Response } from '../../Helpers/Request';
import { JsonValidator } from '../../Helpers/JsonValidator';
import * as Ajv from 'ajv';
import { Currency, PoeNinjaInterface } from '../../types';

export class PoeNinja {

    public static async fetchList (): Promise<Currency.ChaosEquivalent[]> {
        let response: Response;
        try {
            response = await Request.fetchData(`http://poe.ninja/api/Data/GetCurrencyOverview?league=Abyss`);
        } catch (err) {
            throw new Error(`api didn't respond to request`);
        }
        if (!JsonValidator.validate(response.body)) {
            throw new Error(`data returned via api is not correct`);
        }
        const responseData = JSON.parse(response.body);
        if (PoeNinja.validateResponse(responseData)) {
            return PoeNinja.parseResponse(responseData);
        }
        throw new Error('unexpected errors occurred with poeNinja currency validating');
    }

    private static validateResponse (apiData: object): apiData is PoeNinjaInterface.Api {
        const payReceiveSchema = {
            oneof: [
                {type: null},
                {
                    type : 'object',
                    properties: {
                        count: {
                            type: 'number'
                        },
                        dataPointCount : {
                            type: 'number'
                        },
                        getCurrencyId : {
                            type: 'number'
                        },
                        id : {
                            type: 'number'
                        },
                        includes_secondary: {
                            type: 'boolean'
                        },
                        leagueId : {
                            type: 'number'
                        },
                        payCurrencyId : {
                            type: 'number'
                        },
                        sampleTimeUtc: {
                            type: 'string'
                        },
                        value: {
                            type: 'number'
                        }
                    }
                }
            ]
        };
        const mainSchema = {
            type : 'object',
            properties : {
                currencyDetails : {
                    type: 'array',
                    items : {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'number'
                            },
                            icon: {
                                type: 'string'
                            },
                            name: {
                                type: 'string'
                            },
                            poeTradeId: {
                                type: 'number'
                            }
                        }
                    }
                },
                lines : {
                    type: 'array',
                    items : {
                        type: 'object',
                        properties: {
                            chaosEquivalent: {
                                type: 'number'
                            },
                            currencyTypeName : {
                                type: 'string'
                            },
                            pay : payReceiveSchema,
                            receive : payReceiveSchema,
                            // pay and receive spark lines are used for internal site graphics - they're irrelevant here
                            paySparkLine : {
                                type: 'object'
                            },
                            receiveSparkLine : {
                                type: 'object'
                            }
                        }
                    }
                }
            }
        };
        const validator = new Ajv();
        if (validator.validate(mainSchema, apiData)) {
            return true;
        }
        return false;
    }

    private static parseResponse (data: PoeNinjaInterface.Api): Currency.ChaosEquivalent[] {
        const values = data.lines;
        return  values.map(value => {
            let chaosEquivalent;
            if (value.receive && value.pay) {
                chaosEquivalent = (value.receive.value + 1 / value.pay.value) / 2;
            }
            return {
                name: value.currencyTypeName,
                value: chaosEquivalent
            };
        });
    }

}
