import * as mongodb from 'mongodb';
import { Collection, Db } from 'mongodb';
import { Database as DatabaseInterface } from '../types';
import CrudResult = DatabaseInterface.CrudResult;

// "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath  C:\mongoData - starting mongodb

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

    protected async read(queryObject: object = {}, sortObject: object = {},  limit: number = 0): Promise<void> {
        this.result = {};
        try {
            this.internalDb = await MongoClient.connect(this.url);
        } catch (err) {
            this.result.error = err;
            return;
        }
        let collection: Collection = this.internalDb.collection(this.collectionName);
        try {
            this.result.data = await collection
                .find(queryObject)
                .sort(sortObject)
                .limit(limit)
                .toArray();
        } catch (err) {
            this.result.error = err;
        }
        return await this.internalDb.close();
    }

    protected async write(data: object[], options: object = {}): Promise<void> {
        this.result = {};
        try {
            this.internalDb = await MongoClient.connect(this.url);
        } catch (err) {
            this.result.error = err;
            return;
        }
        let collection: Collection = this.internalDb.collection(this.collectionName);
        try {
            await collection.insertMany(data, options);
        } catch (err) {
            this.result.error = err;
        }
        return await this.internalDb.close();
    }

    protected async upsert(query: object, data: object): Promise<void> {
        this.result = {};
        try {
            this.internalDb = await MongoClient.connect(this.url);
        } catch (err) {
            this.result.error = err;
            return;
        }
        let collection: Collection = this.internalDb.collection(this.collectionName);
        try {
            await collection.updateOne(query, data, {upsert: true});
        } catch (err) {
            this.result.error = err;
        }
        return await this.internalDb.close();
    }

    /*protected async update(query: object, update: object): Promise<void> {
        this.clearResult();
        try {
            this.internalDb = await this.connect();
        } catch (err) {
            this.result.error = err;
            return;
        }
        let collection: Collection = this.internalDb.collection(this.collectionName);

    }

    private internalWriteMany (collection: Collection, data: object[], options: object = {}): Promise<CrudResult> {
        return new Promise((resolve, reject) => {
            collection.insertMany(data, options, (err: Error, writeResult) => {
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

    private async internalUpdateMany(collection: Collection, query: object, update: object): Promise<CrudResult> {
        const result =  await collection.updateMany(query, update);
    }*/
}
