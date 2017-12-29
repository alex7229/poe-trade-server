import {Request} from '../Requests/Request'
import {JsonValidator} from '../validators/JsonValidator'

interface ApiData {
    url : string,
    idName : string
}

class IdManager {

    private ninjaApi: ApiData = {
        url: `http://api.poe.ninja/api/Data/GetStats`,
        idName: 'nextChangeId'
    };
    private ratesApi: ApiData = {
        url: 'http://poe-rates.com/actions/getLastChangeId.php',
        idName: 'changeId'
    };

    public async getLatestApiIdAvailable(): Promise<string> {
        //latest key for official api
        const timeout = {
            timeout: 5000
        };
        const ninjaRequest = Request.fetchData(this.ninjaApi.url, timeout);
        const ratesRequest = Request.fetchData(this.ratesApi.url, timeout);
        const ninjaResponse = await ninjaRequest;
        if (this.validateApiIdResponse(ninjaResponse.body, this.ninjaApi.idName) && ninjaResponse.body) {
            return JSON.parse(ninjaResponse.body)[this.ninjaApi.idName]
        }
        const ratesResponse = await ratesRequest;
        if (this.validateApiIdResponse(ratesResponse.body, this.ratesApi.idName) && ratesResponse.body) {
            return JSON.parse(ratesResponse.body)[this.ratesApi.idName]
        }
        throw new Error('available api id was not found')
    }

    private validateApiIdResponse(responseBody: any, idName: string) {
        if (!JsonValidator.validate(responseBody)) {
            return false;
        }
        const parsedResponse = JSON.parse(responseBody);
        if (!parsedResponse.hasOwnProperty(idName) || typeof parsedResponse[idName] !== 'string') {
            return false
        }
        return true;
    }
}

export {IdManager}