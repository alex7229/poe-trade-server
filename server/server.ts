/*
import {UpdateDemon} from "./OfficialApi/UpdateDemon"

let demon = new UpdateDemon();
demon.officialApiUpdate();
*/

import { CurrencyUpdater } from './Currency/CurrencyUpdater';
import { Server } from './types';
import { RequestParamHandler } from 'express';
import { LatestIdRequest } from './Requests/PoeNinja/LatestIdRequest';
import * as compression from 'compression';
import { router as currencyRouter } from './Routes/Currency';

CurrencyUpdater.run();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(compression());

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

/*app.use((req: RequestParamHandler, res: Server.ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
});*/

app.use('/currency', currencyRouter);

app.get('/findLatestId', (req: RequestParamHandler, res: Server.ServerResponse) => {
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
