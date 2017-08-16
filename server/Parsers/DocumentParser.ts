import {Tag} from "../Helpers/Tag"

class DocumentParser {

    private html : string;


    constructor (html: string) {
        this.html = html;
    }

    public findItems () {
        return Tag.findTag(this.html, 'tbody', [{name: 'data-seller'}, {name: 'data-sellerid'}])
    }



}

export {DocumentParser}