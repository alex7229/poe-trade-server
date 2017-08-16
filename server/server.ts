import * as fs from 'fs'
import {Tag} from './Helpers/Tag';


const html : string = fs.readFileSync('../public/index.html', 'utf-8');



Tag.findTag(html, 'tbody');