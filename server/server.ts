import * as fs from 'fs'
import {DocumentParser} from "./Parsers/DocumentParser"
import {ItemParser} from "./Parsers/ItemParser"
import {TagData} from "./Helpers/Tag";

const html : string = fs.readFileSync('../public/index.html', 'utf-8');



let parser = new DocumentParser(html);

const items : TagData[] = parser.findItems();


 //
 // const itemParser = new ItemParser(items[27].tagBody, items[27].innerHtml);
console.time('23');
for (let i=0; i<items.length; i++) {
    try {
        const itemParser = new ItemParser(items[i].tagBody, items[i].innerHtml);

    } catch (err) {
        console.log(`err in item number ${i}`)
    }

}
console.timeEnd('23');
// const itemParser = new ItemParser(items[2].tagBody, items[2].innerHtml);



