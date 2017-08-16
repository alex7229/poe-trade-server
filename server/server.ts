import * as fs from 'fs'
import {DocumentParser} from "./Parsers/DocumentParser"

const html : string = fs.readFileSync('../public/index.html', 'utf-8');

let parser = new DocumentParser(html);

const items = parser.findItems();

let b = 23;