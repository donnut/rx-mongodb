const Rx = require('rxjs');
var driver = null;
var dbInstance = null;

function RxMongodb(driver){
    driver == null ? this.driver = require('mongodb').MongoClient : this.driver = driver.MongoClient;
}

RxMongodb.prototype.connect = function(uri){
    return Rx.Observable.create((observer)=>{
        if (dbInstance != null){
            observer.next(dbInstance);
        } else {
            this.driver.connect(uri, (err, db)=>{
                if (err) {
                    observer.error(err);
                } else {
                    dbInstance = db;
                    observer.next(dbInstance);
                    observer.complete();
                }
            });
        }
    });
}

RxMongodb.prototype.close = function(){
    return Rx.Observable.create((observer)=>{
        try {
            dbInstance.close();
            dbInstance = null;
            observer.next(true);
            observer.complete();
        } catch (e) {
            observer.error(e);
        }
    });
}

RxMongodb.prototype.insert = function(collectionName, entity){
    return Rx.Observable.create(function(observer) {
        if (dbInstance == null) {
            observer.error('null db instance, did you connect the db?')
        } else {
            dbInstance.collection(collectionName).insert(entity, function(err, result) {
                if (err) { 
                    observer.error(err) 
                } else {
                    observer.next(result);
                    observer.complete();
                }
            });
        }
    });
}

RxMongodb.prototype.find = function(collectionName, where){
    return Rx.Observable.create(function (observer) {
        if (dbInstance == null) {
            observer.error('null db instance, did you connect the db?')
        } else {
            dbInstance.collection(collectionName).find(where).toArray(function(err, results) {
                if (err) {
                    observer.error(err)
                } else {
                    observer.next(results);
                    observer.complete();
                }
            });
        }
    });
}

RxMongodb.prototype.remove = function(collectionName, where){
    return Rx.Observable.create(function(observer) {
        if (dbInstance == null) {
            observer.error('null db instance, did you connect the db?')
        } else {
            dbInstance.collection(collectionName).remove(where, function(err, result) {
                if (err) { 
                    observer.error(err) 
                } else {
                    observer.next(result);
                    observer.complete();
                }
            });
        }
    });
}

RxMongodb.prototype.update = function(collectionName, where, delta){
    return Rx.Observable.create(function(observer) {
        if (dbInstance == null) {
            observer.error('null db instance, did you connect the db?')
        } else {
            dbInstance.collection(collectionName).update(where, delta, function(err, result) {
                if (err) { 
                    observer.error(err) 
                } else {
                    observer.next(result);
                    observer.complete();
                }
            });
        }
    });
}

module.exports = RxMongodb;