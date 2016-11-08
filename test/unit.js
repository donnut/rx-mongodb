const assert = require('assert');
const driver = require('mongo-mock');
const Rx = require('rxjs');
const RxMongodb = require('../lib/index.js');
var rxMongodb = null;

const dbName = 'example';
const collectionName = 'users';
const connectionString = 'mongodb://localhost:27017/'+dbName;
const mockDatabaseFile = './test/mongodb.js';

describe("RxMongodb unit tests", function() {
    //this.timeout(10000);
    
    before(function(done) {
        done();
    });

    after(function(done){
        done();
    });

    beforeEach(function(done) {
        rxMongodb = new RxMongodb(driver);
        driver.MongoClient.persist = mockDatabaseFile;
        //create test database
        // Use connect method to connect to the Server 
        driver.MongoClient.connect(connectionString, {}, function(err, db) {
            // Get the documents collection 
            var collection = db.collection(collectionName);
            // Insert some documents 
            var docs = [ 
                {id : 111, name: "Jhon Nash"}, 
                {id : 222, name: "Jim Morison"}, 
                {id : 333, name: "Barak Obama"} 
            ];
            collection.insert(docs, function(err, result) {
                done();
            });
        });
    });

    afterEach(function(done) {
        rxMongodb = null;
        driver.MongoClient.connect(connectionString, {}, function(err, db) {
            // Get the documents collection 
            var collection = db.collection(collectionName);
            collection.remove({}, function(err, result) {
                db.close();
                require('fs').unlink(mockDatabaseFile, function(){
                    done();
                })
            });
        });
    });

    it("should connect database", function(done) {
        rxMongodb
            .connect(connectionString)
            .subscribe(
                db=>{
                    assert.equal('example', db.databaseName);
                    done();
                }
            );
    });

    it("should connect database and close connection", function(done) {
        rxMongodb
            .connect(connectionString)
            .flatMap(db=>rxMongodb.close())
            .subscribe(
                retult=>{
                    assert.equal(true, retult);
                    done();
                }
            );
    });

    it("should insert document", function(done) {
        var toInsert = {id : 444, name: "Lionel Messi"};
        rxMongodb
            .connect(connectionString) 
            .flatMap(db=>rxMongodb.insert(collectionName, toInsert))
            .subscribe(
                insertResult=>{
                    assert.equal('1', insertResult.result.ok);
                    assert.equal('444', insertResult.ops[0].id);
                    done();
                }
            );
    });

    it("should find all document", function(done) {
        rxMongodb
            .connect(connectionString) 
            .flatMap(db=>rxMongodb.find(collectionName, {}))
            .subscribe(
                findResult=>{
                    assert.equal(3, findResult.length);
                    assert.equal('111', findResult[0]['id']);
                    done();
                }
            );
    });

    it("should find id=111 document", function(done) {
        rxMongodb
            .connect(connectionString) 
            .flatMap(db=>rxMongodb.find(collectionName, {id: 111}))
            .subscribe(
                findResult=>{
                    assert.equal(1, findResult.length);
                    assert.equal('111', findResult[0]['id']);
                    done();
                }
            );
    });

    it("should remove all documents", function(done) {
        rxMongodb
            .connect(connectionString) 
            .flatMap(db=>rxMongodb.remove(collectionName, {}))
            .subscribe(
                removeResult=>{
                    assert.equal(3, removeResult.result.n);
                    done();
                }
            );
    });

    it("should remove where id=111", function(done) {
        rxMongodb
            .connect(connectionString) 
            .flatMap(db=>rxMongodb.remove(collectionName, {id: 111}))
            .subscribe(
                removeResult=>{
                    assert.equal(1, removeResult.result.n);
                    assert.equal(1, removeResult.ops.length);
                    assert.equal(111, removeResult.ops[0].id);
                    done();
                }
            );
    });

    it("should update where id=111 to id=999", function(done) {
        rxMongodb
            .connect(connectionString) 
            .flatMap(db=>rxMongodb.update(collectionName, {id: 111}, {$set: {id: 999}}))
            .flatMap(updateResult=>rxMongodb.find(collectionName, {id: 999}))
            .subscribe(
                updateFindResult=>{
                    assert.equal(1, updateFindResult.length);
                    assert.equal(999, updateFindResult[0].id);
                    assert.equal('Jhon Nash', updateFindResult[0].name);
                    done();
                }
            );
    });

})