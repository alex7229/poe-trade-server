import { RequestResponse } from 'request';
import * as request from 'request';

interface Response {
    response: RequestResponse;
    success: boolean;
    error?: string;
    body?: string;
}

class Request {

    static fetchData (url: string, customOptions: {} = {}): Promise<Response> {
        return new Promise((resolve) => {
            const defaultOptions = {
                url,
                gzip: true
            };
            const callback: request.CoreOptions['callback'] = (error, response, body) => {
                let result: Response = {
                    response,
                    success : true
                };
                if (error) {
                    result.success = false;
                    result.error = error;
                } else {
                    result.body = body;
                }
                resolve(result);
            };
            request(Object.assign(defaultOptions, customOptions), callback);
        });
    }

}

export {Request, Response};