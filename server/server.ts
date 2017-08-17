import * as fs from 'fs'
import {DocumentParser} from "./Parsers/DocumentParser"
import {ItemParser} from "./Parsers/ItemParser"
import {TagData} from "./Helpers/Tag";

const html : string = fs.readFileSync('../public/index.html', 'utf-8');

let parser = new DocumentParser(html);

const items : TagData[] = parser.findItems();

const itemParser = new ItemParser(items[0].tagBody, items[0].innerHtml);

