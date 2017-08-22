import {IdManager} from "./IdManager"
import {ItemsManager} from './ItemsManager'
import * as moment from 'moment';
import {Database, CrudResult} from "../Helpers/Database/Database"
import * as fs from 'fs';
import * as util from 'util';
import {ApiValidator} from "./Validator"
import {ApiRequest} from "./ApiRequest"
import {RequestResponse} from "../Helpers/Request";

interface ApiDescription {
    time : string,
    changeId : string,
    exist : boolean
}

class UpdateDemon {

    private currentId : string;
    private readonly officialApiDelay : number = 50;
    private readonly thirdPartyApiDelay : number = 3000;
    private itemsListIds : string[] = [];
    private officialApiSavePath : string = `D:\\\\poe_api_temp_data\\official_api\\`;

    async officialApiUpdate () : Promise<void> {
        if (!this.currentId) {
            const idManager = new IdManager();
            try {
                this.currentId = await idManager.getLatestApiIdAvailable();
            } catch (err) {
                this.retryUpdate(this.thirdPartyApiDelay);
                return;
            }
        }
        let response : RequestResponse;
        try {
            response = await ApiRequest.fetch(this.currentId)
        } catch (err) {
            this.retryUpdate(this.officialApiDelay);
            return;
        }
        if (ApiValidator.validate(response.body) && response.body) {
            const parsedData = JSON.parse(response.body);
            this.currentId = parsedData['next_change_id'];

            //it's ok
        } else {
            //not ok

        }

        this.retryUpdate(this.officialApiDelay);



        /*const itemsManager = new ItemsManager(this.currentId);
        let apiResponse = await itemsManager.getData();
        if (!apiResponse.success) {
            this.retryUpdate(this.officialApiDelay);
            return;
        }
        //validate here
        const validator = new ApiValidator(apiResponse.data);*/


        /*if (apiResponse.data && typeof apiResponse.data === 'object' && apiResponse.data['next_change_id']) {
            const id = apiResponse.data['nex_change_id'];
            const saveFileFunc = util.promisify(fs.writeFile);
            saveFileFunc(this.officialApiSavePath + id + '.json', )
            let database = new Database();
            database.write('officialApi', [apiResponse.data]);
            //currently it's writing async without worry about the result
            this.currentId = apiResponse.data['next_change_id'];
        }
        this.retryUpdate(this.officialApiDelay);*/
        return;
    }

    async saveDescription (apiResponse) {
        return new Promise((resolve, reject) => {
            if (!apiResponse.data || typeof apiResponse.data !== 'object' || !apiResponse.data['next_change_id']) {
                return reject(false)
            }

        })
    }

    async getApiInfoFromDb () {
        return new Promise((resolve, reject) => {

        })
    }

    retryUpdate (timeout : number) : void {
        setTimeout(() => {
            this.officialApiUpdate()
        }, timeout)
    }

    logQueen(data : object) {
        const jsonData = JSON.stringify(data);
        const regExp = /belly/ig;
        /*const match = jsonData.match(regExp);
        if (match) {
            console.log(match);
        }*/



        if (Array.isArray(data['stashes'])) {
            data['stashes'].forEach(stash => {
                if (typeof stash === 'object') {
                    if (stash.public && stash.stashType === 'PremiumStash' && Array.isArray(stash['items']) && stash['items'].length > 0) {
                        const owner = stash.lastCharacterName;
                        stash['items'].forEach(item => {
                            if (typeof item === 'object' && item.league === 'Harbinger' && typeof item.name === 'string') {
                                if (item.name.match(regExp)) {
                                    // price is ~b/o 100 chaos
                                    //console.log(`found someone with price ${item.note}`);
                                    const priceRegExp = /([\d]*) chaos/;
                                    if (typeof item.note !== 'string') return;
                                    const match = item.note.match(priceRegExp);
                                    if (match && match[1]) {
                                        const priceNumber = parseInt(match[1]);
                                        //console.log(priceNumber);
                                        if (priceNumber > 100) {
                                            if (!this.itemsListIds.includes(item.id)) {
                                                this.itemsListIds.push(item.id);
                                                console.log(`owner is ${owner}, price is ${item.note}, name is ${item.name}`)
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    }

}

export {UpdateDemon}

let data = [{
    time: moment().format('DD.MM.YY HH:mm:ss'),
    changeId: 'someid',
    exist: true
}];