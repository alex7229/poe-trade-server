/*
import {UpdateDemon} from "./OfficialApi/UpdateDemon"

let demon = new UpdateDemon();
demon.officialApiUpdate();
*/

import { CurrencyUpdater } from './Updaters/CurrencyUpdater';
import { Server } from './types';
import * as compression from 'compression';
import { CurrencyRouter } from './routers/CurrencyRouter';
import { ModifiersRouter } from './routers/ModifiersRouter';
import { OfficialApiRouter } from './routers/OfficialApiRouter';
/*
import { ModifiersRequest } from './Requests/PoeTrade/ModifiersRequest';

let request = new ModifiersRequest();
request.getModifiers();*/

CurrencyUpdater.run();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(compression());

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/currency', CurrencyRouter);
app.use('/modifiers', ModifiersRouter);
app.use('/officialApi', OfficialApiRouter);

app.post('/addFilter', (req: Server.AddFilterRequest, res: Server.ServerResponse) => {
    res.end('not finished');
});

app.listen(3001);
