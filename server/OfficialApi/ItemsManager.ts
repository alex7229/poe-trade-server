import {IdManager} from "./IdManager"
import {Request} from "../Helpers/Request"

interface ApiRequest {
    success: boolean,
    data? : string
}

class ItemsManager {

    private id : string;

    private apiData : object;

    constructor (id) {
        this.id = id;
    }

    async getData () : Promise<ApiRequest> {
        const response = await Request.fetchData(this.generateLink(), {timeout: 10000});
        if (response.success && response.body) {
            return {
                success : true,
                data : response.body
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