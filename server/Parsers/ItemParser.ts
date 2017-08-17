import {Tag, AttrFinder, TagData, Attribute} from '../Helpers/Tag';
import {Time} from "../Helpers/Time"

interface Price {
    value?: number,
    currency?: string,
    exist : boolean
}

interface TableStats {
    'data-name' : string,
    description : string,
    exist : boolean,
    value? : string
}

interface Requirement {
    name : string,
    value : number,
}

class ItemParser {

    private tbodyTag : string;
    private innerHtml : string;
    private id: number;
    private price : Price = {
        exist: false
    };
    private imageUrl : string;

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

    private requirementsNames : string[] = [
        'Level',
        'Dexterity',
        'Strength',
        'Intelligence',
        'ilvl'
    ];
    private requirements: Requirement[] = [];

    private tableStats : TableStats[] = [
        ['q', 'quality'],
        ['quality_pd', 'physical damage'],
        ['ed', 'elemental damage'],
        ['aps', 'attack speed'],
        ['quality_dps', 'total dps'],
        ['quality_pdps', 'physical dps'],
        ['edps', 'elemental dps'],
        ['quality_armour', 'armour'],
        ['quality_evasion', 'evasion'],
        ['quality_shield', 'shield'],
        ['block', 'block'],
        ['crit', 'critical chance'],
        ['level', 'level']
]
        .map((data) => {
            return {
                'data-name': data[0],
                description: data[1],
                exist: false
            }
        });


    constructor (tbodyTag : string, innerHtml : string) {
        this.tbodyTag = tbodyTag;
        this.innerHtml = innerHtml;
        this.parse();
    }

    public getAllData() {

    }

    private parse() {
        this.setGeneralAttributes();
        this.setId();
        this.setPrice();
        this.setImageUrl();
        this.setTime();
        this.parseRequirementsRow();
        this.parseParameters();
    }

    private setImageUrl() {
        const imageAttr : AttrFinder = Tag.findAttr(this.innerHtml, 'src', 'img');
        if (!imageAttr.attrValue) {
            throw new Error(`Cannot get image url for item`)
        }
        this.imageUrl = decodeURI(imageAttr.attrValue);
    }

    private setTime() {
        //probably it'll be better to make another class with time management if method grows bigger
        const timeTags: TagData[] = Tag.findTag(
            this.innerHtml,
            'span',
            [{name: 'class', value: 'found-time-ago'}],
            true
        );
        const rawTime: string = timeTags[0].innerHtml;
        const timeHelper = new Time(rawTime);
        const time = timeHelper.getStringTime();
    }

    private setGeneralAttributes () {
        this.generalAttributesData = this.generalAttributesNames.map(name => {
            const attr = Tag.findAttr(this.tbodyTag, name, 'tbody');
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
        const rawPrice : AttrFinder = Tag.findAttr(this.tbodyTag, 'data-buyout', 'tbody');
        if (!rawPrice.attrValue) return;
        const regExp : RegExp = /([\d]*) ([\w]*)/;
        const match = rawPrice.attrValue.match(regExp);
        if (!match || !match[1] || !match[2]) {
            throw new Error(`wrong item buyout: ${rawPrice}`);
        }
        this.price.exist = true;
        this.price.value = parseInt(match[1]);
        this.price.currency = match[2];
    }

    private parseRequirementsRow () {
        const tag : TagData[] = Tag.findTag(
            this.innerHtml,
            'ul',
            [{name: 'class', value: 'requirements proplist'}],
            true
        );
        this.requirements = Tag.findTag(tag[0].innerHtml, 'li')
            .map((tagData) => {
                return tagData.innerHtml;
            })
            .map(html => {
                let name : string = 'default';
                let value : number = 0;
                for (let propertyName of this.requirementsNames) {
                    const regExp : RegExp = new RegExp(`${propertyName}[^\\d]*([\\d]{1,3})`);
                    const match = html.match(regExp);
                    if (match && match[1]) {
                        name = propertyName;
                        value = parseInt(match[1]);
                        break;
                    }
                }
                return {
                    name,
                    value
                }
            })
            .filter(({name, value}) => {
                return name !== 'default'
            })
    }

    private parseParameters() {
        const tableData : TagData[] = Tag.findTag(
            this.innerHtml,
            'td',
            [{name:'class', value: 'table-stats'}],
            true
        );
        const tableHtml = tableData[0].innerHtml;
        this.tableStats.map((stat) => {
            const tagData : TagData[] = Tag.findTag(
                tableHtml,
                'td',
                [{'name': 'data-name', value: stat['data-name']}],
                true
            );
            const attr = Tag.findAttr(tagData[0].tagBody, 'data-value', 'td');
            if (attr.attrFound) {
                stat.exist = true;
                stat.value = attr.attrValue;
            }
            return stat;
        })
    }

}

export {ItemParser}