/*
import {UpdateDemon} from "./OfficialApi/UpdateDemon"

let demon = new UpdateDemon();
demon.officialApiUpdate();
*/

import { CurrencyUpdater } from './Currency/CurrencyUpdater';
import { Convertor as CurrencyConvertor } from './Currency/Convertor';
import { DatabaseApi as CurrencyDbApi } from './Currency/api/DatabaseApi';
import { RequestParamHandler, Response } from 'express';

interface CurrencyRequest extends RequestParamHandler {
    body: {
        from: Currency,
        to: string
    };
}

CurrencyUpdater.run();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/convertCurrency', (req: CurrencyRequest, res: Response) => {
    const fromCurrency = req.body.from;
    const toCurrencyName = req.body.to;
    const dbInstance = new CurrencyDbApi();
    dbInstance.fetchLatestListFromDb()
        .then((currencyList: CurrencyList) => {
            const convertor = new CurrencyConvertor(currencyList.exchangeRates, fromCurrency, toCurrencyName);
            const converted: Currency = convertor.convert();
            res.end(JSON.stringify(converted));
        })
        .catch((err) => {
            res.status(500).send('Cannot convert');
        });
});

app.listen(3001);
