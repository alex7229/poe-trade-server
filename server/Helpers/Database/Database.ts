import * as mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;
import * as Db from 'mongodb/lib/db.js'
import * as Collection from 'mongodb/lib/collection.js'
import * as assert from 'assert';

interface ConnectionInfo {
    success : boolean,
    db : Db,
    error ? : Error
}

interface CrudResult {
    success : boolean,
    error ? : Error,
    data ? : {}[]
}

class Database {

    private url : string ='mongodb://localhost:27017/poe_server_test';

    public async read(collectionName : string, sortObject : object = {},  limit : void | number) : Promise<CrudResult> {
        //sortObject example  {'time.timeInMs' : -1} -> will sort time.timeInMs field in descending order (later first)
        let result : CrudResult = {
            success:true
        };
        let connection : ConnectionInfo;
        try {
            connection = await this.connect();
        } catch (err) {
            result.error = err;
            return result;
        }
        let collection : Collection = connection.db.collection(collectionName);
        let readResult : CrudResult;
        try {
            readResult = await this.internalReadMany(collection,sortObject, limit);
        } catch (err) {
            result.error = err;
            result.success = false;
            return result;
        }
        return readResult
    }

    private internalReadMany(collection: Collection, sortObject : object = {}, limit : void | number) : Promise<CrudResult> {
        let options = {};
        if (limit) {
            options['limit'] = limit
        }
        return new Promise((resolve, reject) => {
            collection
                .find({}, options)
                .sort(sortObject)
                .toArray((err, docs) => {
                    let result : CrudResult = {
                        success : true
                    };
                    if (err !== null) {
                        result.success = false;
                        result.error = err;
                        return reject(err)
                    }
                    result.data = docs;
                    return resolve(docs)
                });
        })
    }

    public async write(collectionName : string, data : {}[]) : Promise<CrudResult> {
        let result : CrudResult = {
            success:true
        };
        let connection : ConnectionInfo;
        try {
            connection = await this.connect();
        } catch (err) {
            result.error = err;
            return result;
        }
        let collection : Collection = connection.db.collection(collectionName);
        let writeResult : CrudResult;
        try {
            writeResult = await this.internalWriteMany(collection, data);
        } catch (err) {
            result.error = err;
            result.success = false;
            return result;
        }
        this.close(connection.db);
        return result;
    }

    private internalWriteMany (collection : Collection, data : {}[]) : Promise<CrudResult> {
        return new Promise((resolve, reject) => {
            collection.insertMany(data, (err : Error, writeResult) => {
                let result : CrudResult = {
                    success : true
                };
                try {
                    assert.equal(err, null);
                    assert.equal(data.length, writeResult.result.n);
                    assert.equal(data.length, writeResult.ops.length);
                } catch (err) {
                    result.success = false;
                    result.error = err;
                    return reject(result)
                }
                return resolve(result)
            })
        })
    }

    private connect () : Promise<ConnectionInfo> {
        return new Promise ((resolve, reject) => {
            MongoClient.connect(this.url, (err : Error, db : Db) => {
                let result : ConnectionInfo = {
                    success : true,
                    db
                };
                if (err !== null) {
                    result.success = false;
                    result.error = err;
                    return reject(result)
                }
                resolve (result)
            });
        })
    }

    private close(db : Db) : void {
        db.close();
    }
}

export {Database, CrudResult}