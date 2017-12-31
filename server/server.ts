/*
import {UpdateDemon} from "./OfficialApi/UpdateDemon"

let demon = new UpdateDemon();
demon.officialApiUpdate();
*/

/*
import { CurrencyUpdater } from './Updaters/CurrencyUpdater';
import { Server } from './types';
import * as compression from 'compression';
import { CurrencyRouter } from './routers/CurrencyRouter';
import { ModifiersRouter } from './routers/ModifiersRouter';
import { OfficialApiRouter } from './routers/OfficialApiRouter';

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
*/

import { OfficialApiResponseValidator as Validator } from './validators/OfficialApiResponseValidator';
import { LatestIdRequest } from './requests/PoeNinja/LatestIdRequest';
import { StashApiRequest } from './requests/StashApiRequest';
import { JsonValidator } from './validators/JsonValidator';
import { OfficialApi } from './types';
import Item = OfficialApi.Item;

let idRequest = new LatestIdRequest();
idRequest.getLatestApiId()
    .then((id) => {
        let stashRequest = new StashApiRequest(id);
        stashRequest.fetchStashes()
            .then((response) => {
                let jsonString = response.body;
                let isValid = JsonValidator.validate(jsonString);
                if (isValid) {
                    const stashesResponse = JSON.parse(jsonString);
                    if (Validator.validate(stashesResponse)) {
                        const items: Item[] = stashesResponse.stashes.reduce((current, total) => {
                            return total.items.concat(current);
                        }, []);
                        const propObj = {
                                category: '',
                                frameType: '',
                                h: '',
                                icon: '',
                                id: '',
                                identified: '',
                                ilvl: '',
                                inventoryId: '',
                                league: '',
                                name: '',
                                typeLine: '',
                                verified: '',
                                note: '',
                                w: '',
                                x: '',
                                y: ''
                            };
                        const properties: string[] = [];
                        for (let prop in propObj) {
                            if (propObj.hasOwnProperty(prop)) {
                                properties.push(prop);
                            }
                        }
                        items.forEach((item) => {
                            properties.forEach(property => {
                                if (!item.hasOwnProperty(property)) {
                                    debugger;
                                }
                            });
                        });
                    }
                    debugger;
                }
            });
    });