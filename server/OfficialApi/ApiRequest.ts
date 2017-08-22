import {Request, RequestResponse} from "../Helpers/Request"

class ApiRequest {

    public static async fetch (id : string) : Promise<RequestResponse> {
        return Request.fetchData(this.generateLink(id), {timeout: 20000});
    }

    private static generateLink (id : string) : string {
        return `http://www.pathofexile.com/api/public-stash-tabs?id=${id}`
    }
}

export {ApiRequest}