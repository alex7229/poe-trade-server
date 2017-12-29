import { Request } from '../Request';
import { RequestInterface } from '../../types';

export class ModifiersRequest extends Request {

    private homeUrl: string = 'http://poe.trade/';
    private fetchError: string = 'Poe.trade home page or script are not available';

    public async getModifiersHtml(): Promise<string> {
        const homeHtml: string = await this.fetchPage(this.homeUrl);
        const scriptUrl: string = this.findScriptUrl(homeHtml);
        return await this.fetchPage(scriptUrl);
    }

    private async fetchPage (url: string): Promise<string> {
        let response: RequestInterface.Response;
        try {
            response = await this.fetchData(url);
        } catch (err) {
            throw new Error(this.fetchError);
        }
        return response.body;
    }

    private findScriptUrl(html: string): string {
        const regExp = /src="([^"]*explicit.*\.js)"/;
        const match: RegExpMatchArray | null = html.match(regExp);
        if (match === null) {
            throw new Error('Cannot find script inside home url');
        }
        return this.composeAbsoluteScriptUrl(match[1]);
    }

    private composeAbsoluteScriptUrl (relativeUrl: string): string {
        if (relativeUrl[0] === '/') {
            relativeUrl = relativeUrl.slice(1);
        }
        return this.homeUrl + relativeUrl;
    }

}