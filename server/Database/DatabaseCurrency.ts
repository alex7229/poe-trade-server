import { DatabaseApi, CrudResult } from './DatabaseApi';
import { Currency } from '../types';
import * as Ajv from 'ajv';

export class DatabaseCurrency {
    // divide this class in two - currency manager and poe.ninja.manager
    private dbCollectionName: string = 'currency';

    public async fetchLatestListFromDb (): Promise<Currency.DatabaseList> {
        const db = new DatabaseApi();
        const result: CrudResult = await db.read(this.dbCollectionName, {'updateTime': -1}, 1);
        if (!result.success || !result.data) {
            throw new Error('Error while fetching currency list from db. Check it existence');
        }
        const list = result.data[0];
        if (!this.validateList(list)) {
            throw new Error('Currency list is fetched but it\'s invalid');
        }
        return list;
    }

    public async saveListToDb(list: Currency.DatabaseList): Promise<void> {
        if (!this.validateList(list)) {
            throw new Error('Currency list for saving is invalid');
        }
        const db = new DatabaseApi();
        const writingResult: CrudResult = await db.write(this.dbCollectionName, [list]);
        if (!writingResult.success) {
            throw new Error('There were some problems while saving currency list to db');
        }
    }

    private validateList(list: object): list is Currency.DatabaseList {
        const schema = {
            type: 'object',
            properties: {
                updateTime: {
                    type: 'number'
                },
                exchangeRates: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string'
                            },
                            chaosEquivalent: {
                                oneof: [
                                    {type: 'number'},
                                    {type: 'null'}
                                ]
                            }
                        }
                    }
                },
                _id: {
                    type: 'object'
                }
            }
        };
        const validator = new Ajv();
        if (validator.validate(schema, list)) {
            return true;
        }
        return false;
    }
}