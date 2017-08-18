import {IdManager} from "./IdManager"
import {Request} from "../Helpers/Request"
import {JsonValidator} from "../Helpers/JsonValidator"

interface ApiRequest {
    success: boolean,
    data? : object
}

class ItemsManager {

    private id : string;

    private apiData : object;

    constructor (id) {
        this.id = id;
    }

    async getData () : Promise<ApiRequest> {
        const response = await Request.fetchData(this.generateLink(), {timeout: 10000});
        if (response.success && response.body && JsonValidator.validate(response.body)) {
            this.apiData = JSON.parse(response.body);
            return {
                success : true,
                data : this.apiData
            }
        }
        return {
            success : false
        }
    }

    public generateLink () : string {
        return `http://www.pathofexile.com/api/public-stash-tabs?id=${this.id}`
    }

}

export {ItemsManager}