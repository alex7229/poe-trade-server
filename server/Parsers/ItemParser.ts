import {Tag, AttrFinder, TagData, Attribute} from '../Helpers/Tag';

interface Price {
    value?: number,
    currency?: string,
    exist : boolean
}

interface Requirement {
    name : string,
    value : number,
}

class ItemParser {

    private tbodyTag : string;
    private innerHtml : string;
    private id: number;
    private price : Price;
    private generalAttributesNames: string[] = [
        'data-seller',
        'data-sellerid',
        'data-ign',
        'data-name',
        'data-tab',
        'data-x',
        'data-y'
    ];
    private generalAttributesData: Attribute[] = [];
    private Requirements: Requirement[] = [];


    constructor (tbodyTag : string, innerHtml : string) {
        this.tbodyTag = tbodyTag;
        this.innerHtml = innerHtml;
        this.parse();
    }

    private parse() {
        this.setGeneralAttributes();
        this.setId();
        this.setPrice();
    }

    private setGeneralAttributes () {
        this.generalAttributesData = this.generalAttributesNames.map(name => {
            const attr = Tag.findAttr(this.innerHtml, name, 'tbody');
            return {
                name,
                value : attr.attrFound && attr.attrValue ? attr.attrValue : ''
            }
        })
    }

    private setId () {
        const rawId : AttrFinder = Tag.findAttr(this.tbodyTag, 'id', 'tbody');
        if (!rawId.attrValue) {
            console.log(this.tbodyTag);
            throw new Error('Item without id');
        }
        const regExp : RegExp = /item-container-(\d)+/;
        const match = rawId.attrValue.match(regExp);
        if (!match) {
            throw new Error(`wrong item id: ${rawId}`);
        }
        this.id = parseInt(match[1])
    }

    private setPrice() {
        const rawPrice : AttrFinder = Tag.findAttr(this.tbodyTag, 'buyout', 'tbody');
        if (!rawPrice.attrValue) {
            this.price.exist = false;
            return;
        }
        const regExp : RegExp = /(\d)+ (\w)+/;
        const match = rawPrice.attrValue.match(regExp);
        if (!match || match.length < 3) {
            throw new Error(`wrong item buyout: ${rawPrice}`);
        }
        this.price.exist = true;
        this.price.value = parseInt(match[1]);
        this.price.currency = match[2];
    }

    private parseRequirementsRow () : Requirement[] {
        const tag : TagData[] = Tag.findTag(this.innerHtml, 'ul', [{name: 'class', value: 'requirements proplist'}]);
        if (tag.length !== 0) {
            console.log(tag);
            throw new Error('Multiple props rows for item are not permitted');
        }
        const propertiesNames : string[] = ['Level', 'Dexterity', 'Strength', 'Intelligence', 'ilvl'];
        return Tag.findTag(tag[0].innerHtml, 'li')
            .map((tagData) => {
                return tagData.innerHtml;
            })
            .filter((html) => {
                return propertiesNames.some((propertyName) => {
                    const regExp : RegExp = new RegExp(`${propertyName}[\s\S]*[\d]`);
                    return html.match(propertyName) !== null;
                })
            })
            .map(html => {
                let name : string = 'default. Should be overwritten anyways';
                let value : number = 0;
                for (let propertyName of propertiesNames) {
                    const regExp : RegExp = new RegExp(`${propertyName}[^\d]*([\d]{1,3})`, 'ig');
                    const match = html.match(regExp);
                    if (match && match.length === 3) {
                        name = match[1];
                        value = parseInt(match[2]);
                        break;
                    }
                }
                return {
                    name,
                    value
                }
            })
    }

}