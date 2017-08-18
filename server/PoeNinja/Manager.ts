//requests to http://poe.ninja/stats

import {Request} from '../Helpers/Request'
import {JsonValidator} from '../Helpers/JsonValidator'

interface ApiId {
    success: boolean,
    id? : string
}

class PoeNinjaManager {

    private officialApiId : string;
    private poeApiUrl : string = 'http://api.poe.ninja/api/Data/GetStats';

    constructor () {
        
    }

    public async getLatestApiId () : Promise<ApiId> {
        //latest key for official api
        const response = await Request.fetchData('http://api.poe.ninja/api/Data/GetStats');
        if (!response.success) {
            //throw an error temporary
            throw new Error('poe ninja api request finished with error')
        }
        if (!PoeNinjaManager.validateApiIdResponse(response.body)) {
            throw new Error('poe ninja api response is invalid')
        }
        return {
            success: true,
            id: response.body.nextChangeId
        }

    }

    private validateApiIdResponse (response) {
        if (!JsonValidator.validate(response)) {
            return false;
        }
        if (!response.nextChangeId || typeof response.nextChangeId !== 'string') {
            return false
        }
        return true;
    }

}