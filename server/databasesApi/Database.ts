import * as mongodb from 'mongodb';
import { Collection, Db } from 'mongodb';
import * as assert from 'assert';
import { Database as DatabaseInterface } from '../types';
import CrudResult = DatabaseInterface.CrudResult;

// "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath  D:\OneDrive\mongoData - starting mongodb

const MongoClient = mongodb.MongoClient;

// todo: very important. To make sure all db methods don't throw errors. They should only update this.result.error
// those methods would be used without try catch outside this class

export class Database {

    private url: string = 'mongodb://localhost:27017/poe_server_test';
    private result: CrudResult;
    private internalDb: Db;
    private collectionName: string;

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }

    protected getResult(): CrudResult {
        return this.result;
    }

    protected async read(queryObject: object = {}, sortObject: object = {},  limit: undefined | number): Promise<void> {
        // sortObject example  {'time.timeInMs': -1} -> will sort time.timeInMs field in descending order (later first)
        this.clearResult();
        try {
            this.internalDb = await this.connect();
        } catch (err) {
            this.result.error = err;
            return;
        }
        let collection: Collection = this.internalDb.collection(this.collectionName);
        try {
            this.result = await this.internalReadMany(collection, queryObject, sortObject, limit);
        } catch (err) {
            this.result.error = err;
            return;
        }
        this.closeConnection();
        return;
    }

    protected async write(data: object[]): Promise<void> {
        this.clearResult();
        try {
            this.internalDb = await this.connect();
        } catch (err) {
            this.result.error = err;
            return;
        }
        let collection: Collection = this.internalDb.collection(this.collectionName);
        try {
            this.result = await this.internalWriteMany(collection, data);
        } catch (err) {
            this.result.error = err;
            return;
        }
        this.closeConnection();
        return;
    }

    private internalReadMany
    (
        collection: Collection,
        queryObject: object,
        sortObject: object,
        limit: undefined | number
    ): Promise<CrudResult> {
        return new Promise((resolve, reject) => {
            collection
                .find(queryObject, limit ?  {limit} : undefined)
                .sort(sortObject)
                .toArray((err, docs) => {
                    if (err !== null) {
                        return reject({err});
                    }
                    return resolve({data: docs});
                });
        });
    }

    private internalWriteMany (collection: Collection, data: {}[]): Promise<CrudResult> {
        return new Promise((resolve, reject) => {
            collection.insertMany(data, (err: Error, writeResult) => {
                try {
                    assert.equal(err, null);
                    assert.equal(data.length, writeResult.result.n);
                    assert.equal(data.length, writeResult.ops.length);
                } catch (err) {
                    return reject({err});
                }
                return resolve({});
            });
        });
    }

    private clearResult(): void {
        this.result = {};
    }

    private connect (): Promise<Db> {
        return new Promise ((resolve, reject) => {
            MongoClient.connect(this.url, (err: Error, db: Db) => {
                if (err !== null) {
                    return reject(err);
                }
                return resolve (db);
            });
        });
    }

    private closeConnection(): void {
        if (this.internalDb) {
            this.internalDb.close();
        }
    }
}
