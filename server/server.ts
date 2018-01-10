/*
import {UpdateDemon} from "./OfficialApi/UpdateDemon"

let demon = new UpdateDemon();
demon.officialApiUpdate();
*/

// default
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

// fetcher
/*import { OfficialApiResponseValidator as Validator } from './validators/OfficialApiResponseValidator';
// import { LatestIdRequest } from './requests/PoeNinja/LatestIdRequest';
import { StashApiRequest } from './requests/StashApiRequest';
// import { JsonValidator } from './validators/JsonValidator';
import { OfficialApi, RequestInterface } from './types';
// import Item = OfficialApi.Item;
import GeneralResponse = OfficialApi.GeneralResponse;
import { ModifiersDatabase } from './databasesApi/ModifiersDatabase';

async function getResponse(id: string): Promise<GeneralResponse> {
    const stashRequest = new StashApiRequest(id);
    let response: RequestInterface.Response;
    let apiResp: object;
    try {
        response = await stashRequest.fetchStashes();
        apiResp = JSON.parse(response.body);
    } catch (err) {
        throw new Error('error during download');
    }
    if (!checkResponse(apiResp)) {
        throw new Error('error during validation');
    }
    return apiResp;
}

function checkResponse(apiResp: object): apiResp is GeneralResponse {
    return Validator.validate(apiResp);
}

let modsCount: number[] = Array(20).fill(0);

async function fetchResponsesContinuously (
    id: string
): Promise<GeneralResponse> {
    let res = await getResponse(id);
    console.log(JSON.stringify(res).length);
    return fetchResponsesContinuously(res.next_change_id);
}

fetchResponsesContinuously('128571206-134550501-126222320-145414677-136008522');*/

// console.time('download');
/*let idRequest = new LatestIdRequest();
idRequest.getLatestApiId()
    .then(id => {
        fetchResponsesContinuously(id);
    });*/
/// some data
// const firstId = '126553920-132466241-124259500-143210747-133883517';
// fetchResponsesContinuously(firstId, 0);
//
// current id  =  '122812208-128445806-120878249-138348759-129697704'
// current items = '2640514'
//
// mystashid = "f2bf75bd84b6d511ad671d089e84f9bb6845cbad36d5f5fafa223adcd536f066"
// name: sell
// todo: important note. If you change item in the stash - stash id DOESN"T change
// if you change stash name - id is not changed either
// check if changing to private make sense
// check if  you get the current stash from low-number id
// check if entering/exiting  hideout does shit

// compressed item structure. Should be refactored later. No point in saving small keys
// const item = {
//     // category. Should be an index and should be in the categories collection
//     c: 'oneaxe',
//     // mods, (all: explicit, crafted, else), link to mod, values. The most important part
//     // 'abssc' - it's not a name of mod!. It's id of mod. It must be unique and it should be used as an index
//     m: [
//         ['abssc', 12, 14],
//         ['basas', 10],
//         ['kukas', 12, 43],
//         ['basas', 10]
//     ],
//     // icon link
//     i: 'bisaga',
//     // is id important though?
//     _id: '"281da95d86c0942b4b6fe8dce2123887f4eb93651144015cea007c557f942460"',
//     f: 1,
//     iden: true,
//     ilvl: 70,
//     // invid? useful?
//     invId: 'stash2',
//     // current league, can be shortened. Definitely should be an index. (It's useless to search for an item in
//     // multiple leagues at the same time). Can contain obsolete leagues (but those stashes will be removed via api)
//     // if current league is abyss, and you fetching old data from api - league can be harbinger, and later this stash
//     // will be deleted
//     l: 'abyss',
//     // link to names list. An index (for unique items)
//     name: 'lista',
//     // some socket patters. Index.
//     s: 'SGBI',
//     // requirements: level, strengt, dex, else. Some pattern. Index. Should be indexed by pattern type name.
//     // basta is id of pattern object
//     req: ['basta', 23, 23, false, 13, 11],
//     // An index.
//     props: {
//         // link to props types object in db
//         type: 'basks',
//         v: ['5.02%', '1,52', '2,23', '2.32', '1202']
//     },
//     // position x + y
//     x: 12,
//     y: 32,
//     // link to typeline list. For example, typeline: "<<set:MS>><<set:M>><<set:S>>Combatant's Siege Axe of Mastery"
//     // an index? the name is odd
//     tLine: 'fsibasks',
//     // other data like desc or secDescr - should link to some collection. Don't make useless fields as indices
//     // stash id should be an index too. In case if you need to delete items from stash.
//     stashId: 'isdisd'
// };

// items count is around 15,160,700 for standard (not active)
// and 4,730,880 for abyss (not active)
// there is around 700k stashes with more than 1 item inside
// stashed for standard and abyss have different ids
// other items are active (changing all the time)

// indices sizes test
import { IndicesSizeTestDatabase } from './databasesApi/IndicesSizeTestDatabase';

interface Modifier {
    type: number;
    value: number;
}

interface Item {
    name: string;
    mods: Modifier[];
}

interface ModifierType {
    _id: number;
    types: number[];
}

function getRandomMods(isLife: boolean): Modifier[] {
    let mods: Modifier[] = [];
    const modsCount = Math.floor(Math.random() * 7);
    for (let i = 0; i < modsCount; i++) {
        mods.push({
            type: Math.floor(Math.random() * 1000),
            value: Math.floor(Math.random() * 100)
        });
    }
    const lifeType = 217;
    if (isLife && modsCount > 0) {
        const lifeModIndex = Math.floor(Math.random() * modsCount);
        const value = Math.round(Math.random() * 80);
        mods[lifeModIndex] = {type: lifeType, value};
    }
    return mods;
}

function getRandomModTypes(): number[] {
    let mods: number[] = [];
    const modsCount = Math.floor(Math.random() * 7);
    for (let i = 0; i < modsCount; i++) {
        mods.push(Math.floor(Math.random() * 32));
    }
    return mods;
}

function getRandomName(): string {
    const chars = 'qwertyuiopasdfghjklzxcvbnm';
    return Array(3).fill('').map(() => {
        const index = Math.floor(Math.random() * 26);
        return chars[index];
    }).join('');
}

function getModifiers(count: number): ModifierType[] {
    return Array(count)
        .fill(0)
        .map((item, index) => ({
            _id: Math.floor(Math.random() * (10 ** 9)),
            types: getRandomModTypes()}
        ));
}

async function save() {
    for (let i = 0; i < 7; i++) {
        let db = new IndicesSizeTestDatabase();
        await db.update(getModifiers(1000 * 1000));
        console.log(`${i} millions saved`);
    }
    /*console.time('start');
    let db = new IndicesSizeTestDatabase();
    await db.update(getModifiers(5000));
    console.timeEnd('start');*/
}

let array = Array(1000000)
    .fill(Math.random() * 1000);

console.time('start');
array.sort();
console.timeEnd('start');

// save();
