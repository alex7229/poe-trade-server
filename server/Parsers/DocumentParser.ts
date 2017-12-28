import { Tag, TagData } from '../../Helpers/TagParser';

class DocumentParser {

    private html: string;

    constructor (html: string) {
        this.html = html;
    }

    public findItems (): TagData[] {
        return Tag.findTag(this.html, 'tbody', [{name: 'data-seller'}, {name: 'data-sellerid'}]);
    }

    public findTotalItemsCount(): number  {
        const tag: TagData[] = Tag.findTag(this.html, 'h3', [{name: 'class', value: 'title'}], true);
        const regExp: RegExp = /\(([\d]*) results\)/;
        const match = tag[0].innerHtml.match(regExp);
        if (!match) {
            throw new Error('cannot parse total items number');
        }
        return parseInt(match[1], 10);
    }

}

export {DocumentParser};