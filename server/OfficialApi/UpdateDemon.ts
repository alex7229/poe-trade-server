import {IdManager} from "./IdManager"
import {ItemsManager} from './ItemsManager'
import * as moment from 'moment';

class UpdateDemon {

    private currentId : string;
    private readonly officialApiDelay : number = 50;
    private readonly thirdPartyApiDelay : number = 3000;

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
        const itemsManager = new ItemsManager(this.currentId);
        let apiResponse = await itemsManager.getData();
        if (!apiResponse.success) {
            this.retryUpdate(this.officialApiDelay)
        }
        if (apiResponse.data) {
            console.log(apiResponse.data)
        }
    }

    retryUpdate (timeout : number) : void {
        setTimeout(() => {
            this.officialApiUpdate()
        }, timeout)
    }

}

export {UpdateDemon}