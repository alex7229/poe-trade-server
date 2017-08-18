import * as fs from 'fs'
import {DocumentParser} from "./Parsers/DocumentParser"
import {TagData} from "./Helpers/Tag";
import {ItemManager} from "./ItemManager";
import {ItemParser, Item} from "./Parsers/ItemParser";

const html : string = fs.readFileSync('../public/index.html', 'utf-8');



let parser = new DocumentParser(html);

const itemsHtmlData : TagData[] = parser.findItems();
const itemsCount : number = parser.findTotalItemsCount();
const items : Item[] = itemsHtmlData.map(({tagBody, innerHtml}) => {
    const itemParser = new ItemParser(tagBody, innerHtml);
    return itemParser.getAllData()
});

const itemManager = new ItemManager(items, itemsCount);

debugger;



var insertDocuments = function(db, callback, data : Item[]) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insertMany(data, function(err, result) {
        assert.equal(err, null);
        assert.equal(99, result.result.n);
        assert.equal(99, result.ops.length);
        console.log("Inserted 3 documents into the document collection");
        callback(result);
    });
}




import * as mongodb from 'mongodb';
import * as assert from 'assert';

var MongoClient = mongodb.MongoClient;




// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    insertDocuments(db, function() {
        db.close();
    }, items);
});