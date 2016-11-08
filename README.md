# rx-mongodb is a reactive drive to mongodb for rxjs developers
<a href="https://travis-ci.org/badges/shields">
    <img src="https://travis-ci.org/tWinE-xx/rx-mongodb.svg?branch=master"
            alt="build status">
</a>

# Installation
```js
npm install rx-mongodb
```

#run tests
```js
npm install rx-mongodb
goto: $/node_modules/rx-mongodb
npm test
```

### Connecting to MongoDB
```js
const mongodb = require('mongodb');
const rxMongodb = new RxMongodb(mongodb);
const dbName = 'example';
const collectionName = 'users';
const connectionString = 'mongodb://localhost:27017/'+dbName;
rxMongodb
    .connect(connectionString)
    .subscribe(
        db=>{
            //Your code from here
        }
    );
```

### Closing database connection
```js
const mongodb = require('mongodb');
const rxMongodb = new RxMongodb(mongodb);
const dbName = 'example';
const collectionName = 'users';
const connectionString = 'mongodb://localhost:27017/'+dbName;
 rxMongodb
    .connect(connectionString)
    .flatMap(db=>rxMongodb.close())
    .subscribe(
        retult=>{
            //Your code from here
        }
    );
```

### Inserting a Document
```js
const mongodb = require('mongodb');
const rxMongodb = new RxMongodb(mongodb);
const dbName = 'example';
const collectionName = 'users';
const connectionString = 'mongodb://localhost:27017/'+dbName;
rxMongodb
    .connect(connectionString) 
    .flatMap(db=>rxMongodb.insert(collectionName, toInsert))
    .subscribe(
        insertResult=>{
            //Your code from here
        }
    );
```

### Updating a document
```js
const mongodb = require('mongodb');
const rxMongodb = new RxMongodb(mongodb);
const dbName = 'example';
const collectionName = 'users';
const connectionString = 'mongodb://localhost:27017/'+dbName;
rxMongodb
    .connect(connectionString) 
    .flatMap(db=>rxMongodb.update(collectionName, {id: 111}, {$set: {id: 999}}))
    .subscribe(
        updateFindResult=>{
            //Your code from here
        }
    );
```

### Delete a document
```js
const mongodb = require('mongodb');
const rxMongodb = new RxMongodb(mongodb);
const dbName = 'example';
const collectionName = 'users';
const connectionString = 'mongodb://localhost:27017/'+dbName;
rxMongodb
    .connect(connectionString) 
    .flatMap(db=>rxMongodb.remove(collectionName, {id: 111}))
    .subscribe(
        removeResult=>{
            //Your code from here
        }
    );
```
