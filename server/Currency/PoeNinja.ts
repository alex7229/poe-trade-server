import {Request, RequestResponse} from "../Helpers/Request"
import {JsonValidator} from "../Helpers/JsonValidator"
import * as Ajv from 'ajv'
import {CurrencyListValue} from "./Currency"

interface PayReceive {
    count : number,
    dataPointCount : number,
    getCurrencyId : number,
    id: number,
    leagueId: number,
    payCurrencyId : number,
    sampleTimeUtc : string,
    value : number
}

interface CurrencyDetails {
    id: number,
    icon: string,
    name: string,
    poeTradeId: number,
    type: number,
    shorthands : string[]
}

interface Lines {
    chaosEquivalent : number,
    currencyTypeName : string,
    pay : PayReceive,
    receive : PayReceive,
    paySparkLine  : object[],
    receiveSparkLine : object[]
}

interface PoeNinjaApi {
    currencyDetails : CurrencyDetails[],
    lines : Lines[]
}

class PoeNinja {

    private static validateResponse (apiData : object) : apiData is PoeNinjaApi {
        const payReceiveSchema = {
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
                            },
                            type: {
                                type: 'number'
                            },
                            shorthands: {
                                type: 'array',
                                items: {
                                    type: 'string'
                                }
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
                            //pay and receive spark lines are used for internal site graphics - they're irrelevant here
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
            return true
        }
        return false;
    }

    private static parseResponse (data : PoeNinjaApi) : CurrencyListValue[] {
        const values = data.lines;
        const descriptions  = data.currencyDetails;
        return  values.map(value => {
            return {
                name : value.currencyTypeName,
                chaosEquivalent : (value.receive.value + 1/value.pay.value)/2,
                shorthands : PoeNinja.findShorthands(descriptions, value.currencyTypeName)
            }
        });
    }

    private static findShorthands (descriptions : CurrencyDetails[], name : string) : string[] {
        const shorthands = descriptions.filter(description => {
            return name === description.name;
        }).map(description => {
            return description.shorthands
        });
        return shorthands.length === 1 ? shorthands[0] : []
    }

    public static async getExchangeRates () : Promise<CurrencyListValue[]> {
        let response : RequestResponse;
        try {
            response = await Request.fetchData(`http://api.poe.ninja/api/Data/GetCurrencyOverview?league=Harbinger`);
        } catch (err) {
            throw new Error(`api didn't respond to request`)
        }
        if (!JsonValidator.validate(response.body)) {
            throw new Error(`data returned via api is not correct`)
        }
        const responseData = JSON.parse(response.body);
        if (PoeNinja.validateResponse(responseData)) {
            return PoeNinja.parseResponse(responseData)
        }
        throw new Error('unexpected errors occurred with poeNinja currency validating')
    }

}

export {PoeNinja}