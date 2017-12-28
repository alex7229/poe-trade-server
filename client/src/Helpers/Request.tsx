export class Request {
    static async fetchPostJson(url: string, data: string): Promise<string> {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        let result = await fetch(url, {
            method: 'POST',
            headers,
            body: data
        });
        return result.text();
    }

    static async fetchGetJson(url: string): Promise<string> {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        const response = await fetch(url, {
            method: 'GET',
            headers
        });
        return response.text();
    }
}