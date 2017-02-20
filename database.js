
var mongodb = require('mongodb').MongoClient;

var Database = {
  url: 'mongodb://localhost:27017/redtea',

  open: function(callback) {
    if (Database.db && callback) return callback(Database.db);
    mongodb.connect(Database.url, function(err, result) {
      Database.db = result;
      if (err) throw err;
      if (callback) callback(result);
    });
  },

  close: function() {
    if (Database.db) {
      Database.db.close();
      delete Database.db;
    }
  },

  upsert: function(type, data, callback) {
    console.log(`Database.upsert type: ${type}, data: ${JSON.stringify(data)}`);
    Database.open(function(db) {
      var collection = db.collection(type);
      var query      = {id:data.id};
      collection.updateOne(query, {"$set":data}, {upsert:true}, function(err) {
        if (err) throw err;
        if (callback) callback();
      });
    });
  },

  find: function(type, query, callback) {
    console.log(`Database.find type: ${type}, query: ${JSON.stringify(query)}`);
    Database.open(function(db) {
      var collection = db.collection(type);
      collection.find(query).toArray(function(err, results) {
        if (err) throw err;
        console.log(`Database.find results: ${JSON.stringify(results)}`);
        if (callback) callback(results);
      });
    });
  }
};

module.exports = Database;
