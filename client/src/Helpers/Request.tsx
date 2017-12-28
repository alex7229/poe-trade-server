import axios, { AxiosResponse } from 'axios';

export class Request {
    static async fetchPostJson(url: string, data: string): Promise<string> {
        let response: AxiosResponse<string>;
        try {
            response  = await axios.post(url, data);
        } catch (err) {
            throw new Error(err.response.data ? err.response.data : err.message);
        }
        return JSON.stringify(response.data);
    }

    static async fetchGetJson(url: string): Promise<string> {
        let response: AxiosResponse<string>;
        try {
            response  = await axios.get(url);
        } catch (err) {
            throw new Error(err.response.data ? err.response.data : err.message);
        }
        return JSON.stringify(response.data);
    }
}