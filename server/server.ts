import * as fs from 'fs'
import {DocumentParser} from "./Parsers/DocumentParser"
import {TagData} from "./Helpers/TagParser";
import {ItemManager} from "./ItemManager";
import {ItemParser, Item} from "./Parsers/ItemParser";

/*
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
*/



/*
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
});*/

/*
import * as request from 'request';





function makeRequest (url) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            gzip: true
        }, function (error, response, body) {
            if (error) {
                return reject(error);
            }
            return resolve (body);
        });
    })
}

function generateLink (id) {
    return `http://www.pathofexile.com/api/public-stash-tabs?id=${id}`
}

function getNextId(body) {
    return JSON.parse(body).next_change_id
}



function getLatestIdFromSite() {
    return new Promise((resolve, reject) => {
        makeRequest(`http://api.poe.ninja/api/Data/GetStats`)
            .then(result => {
                if (typeof result !== 'string') {
                    console.log(`some problems with result: ${result}`)
                } else {
                    console.log(`Latest id from site is ${result}`)
                    return resolve (JSON.parse(result).nextChangeId)
                }
            }, err => {
                return reject(err)
            });
    })
}


let lastId : string = '81915984-86045759-80719492-93526330-87103669';


function findLastId(currentId) {
    makeRequest(generateLink(currentId))
        .then(result => {
            const newId = getNextId(result);
            if (newId === lastId) {
                console.log(`success, current id is ${newId} and it is last at the moment`)
            } else {
                console.log(`current id is ${newId}`);
                lastId = newId;
                setTimeout(() => {
                    findLastId(newId)
                }, 50)
            }
        }, err => {
            console.log(err)
        })
}*/

/*
getLatestIdFromSite()
    .then(id => {
        if (typeof id=== 'string') {
            lastId = id;
            findLastId(id);
        }
    }, err => {
        console.log(err)
    })
*/

import {UpdateDemon} from "./OfficialApi/UpdateDemon"

let demon = new UpdateDemon();
demon.officialApiUpdate();