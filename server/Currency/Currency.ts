import {Database} from "../Helpers/Database/Database"
import * as moment from 'moment';
import {Moment, unitOfTime} from "moment";
import {PoeNinja} from "./PoeNinja"
import {CrudResult} from "../Helpers/Database/Database"

interface Currency {
    value : number,
    name : string
}

interface CurrencyListValue {
    name : string,
    shorthands : string[],
    chaosEquivalent : number
}

interface CurrencyList {
    time : {
        timeInMs : number,
        dayOfUpdate : string
    }
    exchangeRates : CurrencyListValue[]
}

class CurrencyManager {
    //divide this class in two - currency manager and poe.ninja.manager

    private static currencyList : CurrencyList;
    private static dbCollectionName : string = 'currency';

    private static async updateCurrencyList () : Promise<void> {
        //finish this stuff - save to db and retrieve from db
        // and update currency from poe.ninja when necessary
        debugger;
        const list : CurrencyList = CurrencyManager.currencyList;

        const listFromDb = await CurrencyManager.getCurrencyFromDb();
        if (list && !CurrencyManager.isListOutdated(list)) return;
        if (listFromDb) return;
        //we don't have list and db is empty
        const poeNinjaRates : CurrencyListValue[] = await PoeNinja.getExchangeRates();
        //there is no try/catch block - currency should exist 100%
        //if there is no currency is bd and poe.ninja doesn't respond - terminate program
        CurrencyManager.setList(poeNinjaRates);
        //try to write here
        CurrencyManager.saveToDb()
    }

    private static setList (list : CurrencyListValue[]) {
        CurrencyManager.currencyList = {
            exchangeRates : list,
            time: {
                timeInMs : moment.now(),
                dayOfUpdate : moment().format('DD.MM.YYYY')
            }
        }
    }

    private static isListOutdated (list : CurrencyList) : boolean {
        const now = moment();
        const listTime = moment(list.time.dayOfUpdate, 'DD.MM.YYYY');
        return now.diff(listTime, 'days') >= 1;
    }

    private static async getCurrencyFromDb () : Promise<CurrencyList | null> {
        //get data
        //temp. solution
        let db = new Database();
        const sortObject = {
            'time.timeInMs' : -1
        };
        db.read('currency', sortObject, 1)
            .then(result => {
                debugger;
            })
        return null
    }

    private static async saveToDb () : Promise<CrudResult> {
        if (!CurrencyManager.currencyList) {
            return {
                success: false,
                error: new Error('list is not defined to save it')
            }
        }
        const db = new Database();
        return db.write(CurrencyManager.dbCollectionName, [CurrencyManager.currencyList]);
    }


    public static async getExchangeRate (from : Currency, toCurrencyName : string = 'chaos') : Promise<Currency> {
        await CurrencyManager.updateCurrencyList();
        let fromRates = CurrencyManager.getPriceInChaos(from.name);
        let toRates = CurrencyManager.getPriceInChaos(toCurrencyName);
        return {
            name : toCurrencyName,
            value : fromRates*from.value/toRates
        }
    }

    private static getPriceInChaos (currencyName : string) : number {
        if (currencyName === 'chaos') {
            return 1
        }
        const foundedCurrency = CurrencyManager.currencyList.exchangeRates.find (currentCurrency => {
            let shorthands = currentCurrency.shorthands;
            shorthands.push(currentCurrency.name);
            return shorthands.some(shorthand => {
                const regExp : RegExp = new RegExp(currencyName, 'i');
                return shorthand.match(regExp) !== null;
            })
        });
        if (foundedCurrency === undefined) {
            throw new Error(`cannot convert ${currencyName} to chaos`)
        }
        return foundedCurrency.chaosEquivalent
    }
}

export {Currency, CurrencyManager, CurrencyListValue}