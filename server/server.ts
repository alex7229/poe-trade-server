/*
import {UpdateDemon} from "./OfficialApi/UpdateDemon"

let demon = new UpdateDemon();
demon.officialApiUpdate();
*/

import { CurrencyUpdater } from './Currency/CurrencyUpdater';
import { Converter as CurrencyConverter } from './Currency/Converter';
import { DatabaseCurrency as CurrencyDbApi } from './Database/DatabaseCurrency';
import { Server, Currency } from './types';
import { RequestParamHandler } from 'express';
import { LatestIdRequest } from './Requests/PoeNinja/LatestIdRequest';
import * as compression from 'compression';

CurrencyUpdater.run();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(compression());

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/convertCurrency', (req: Server.CurrencyRequest, res: Server.ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    const fromCurrency = req.body.from;
    const toCurrencyName = req.body.to;
    const dbInstance = new CurrencyDbApi();
    dbInstance.fetchLatestListFromDb()
        .then((currencyList: Currency.DatabaseList) => {
            const converter = new CurrencyConverter(currencyList.exchangeRates, fromCurrency, toCurrencyName);
            const converted: Currency.Quantity = converter.convert();
            res.end(JSON.stringify(converted));
        })
        .catch((err) => {
            res.status(500).send('Cannot convert');
        });
});

app.get('/findLatestId', (req: RequestParamHandler, res: Server.ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    const request = new LatestIdRequest();
    request.getLatestApiId()
        .then((id) => {
            res.end((JSON.stringify({id})));
        })
        .catch(err => {
            res.status(500).end(err.message);
        });
});

app.post('/addFilter', (req: Server.AddFilterRequest, res: Server.ServerResponse) => {
    res.end('not finished');
});

app.listen(3001);
