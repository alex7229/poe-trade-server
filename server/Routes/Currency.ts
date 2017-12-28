import { Currency, Server } from '../types';
import { RequestParamHandler } from 'express';
import { DatabaseCurrency as CurrencyDbApi } from '../Database/DatabaseCurrency';
import { Converter as CurrencyConverter } from '../Currency/Converter';

const express = require('express');
const router = express.Router();

router.get('/names', (req: RequestParamHandler, res: Server.ServerResponse) => {
    const dbInstance = new CurrencyDbApi();
    dbInstance.fetchLatestListFromDb()
        .then((currencyList: Currency.DatabaseList) => {
            const namesList: string[] = currencyList.exchangeRates.map((currency) => {
                return currency.name;
            });
            res.end(JSON.stringify(namesList));
        })
        .catch((err) => {
            res.status(500).send('Cannot retrieve list');
        });
});

router.post('/convert', (req: Server.CurrencyRequest, res: Server.ServerResponse) => {
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

export { router };