import * as request from 'request';

interface RequestResponse {
    response: any,
    success : boolean,
    error? : string,
    body? : string
}

class Request {

    static fetchData (url : string, customOptions : Object = {}) : Promise<RequestResponse> {
        return new Promise((resolve) => {
            const defaultOptions = {
                url,
                gzip: true
            };
            request(Object.assign(defaultOptions, customOptions), function (error, response, body) {
                let result : RequestResponse = {
                    response,
                    success : true
                };
                if (error) {
                    result.success = false;
                    result.error = error;
                } else {
                    result.body = body;
                }
                resolve(result)
            });
        })
    }

}

export {Request, RequestResponse}