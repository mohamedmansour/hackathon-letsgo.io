var azure = require('azure')
  , uuid = require('node-uuid');
  
module.exports = User;

function User(storageClient, tableName, partitionKey) {
  this.storageClient = storageClient;
  this.tableName = tableName;
  this.partitionKey = partitionKey;


  this.storageClient.createTableIfNotExists(tableName, 
    function tableCreated(err) {
      if(err) {
        throw error;
      }
    });
};

User.prototype = {
  find: function(query, callback) {
    self = this;
    self.storageClient.queryEntities(query, 
      function entitiesQueried(err, entities){
        if(err) {
          callback(err);
        } else {
          callback(null, entities);
        }
      });
  },


  addItem: function(item, callback) {
    self = this;
    item.RowKey = uuid();
    item.PartitionKey = self.partitionKey;
    item.completed = false;
    self.storageClient.insertEntity(self.tableName, item, 
      function entityInserted(error) {
        if(error){  
          callback(err);
        }
        callback(null);
      });
  },


  updateItem: function(item, callback) {
    self = this;
    self.storageClient.queryEntity(self.tableName, self.partitionKey, item,
      function entityQueried(err, entity) {
       if(err) {
          callback(err);
        }
        entity.completed = true;
        self.storageClient.updateEntity(self.tableName, entity,
          function entityUpdated(err) {
            if(err) {
              callback(err);
            }
            callback(null);
          });
      });
  }
};