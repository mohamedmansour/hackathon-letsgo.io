var azure = require('azure')
  , async = require('async');


module.exports = UserList;


function UserList(user) {
  this.user = user;
}

UserList.prototype = {
  showUsers: function(req, res) {
    self = this;
    var query = azure.TableQuery
      .select()
      .from(self.user.tableName)
      .where('completed eq ?', 'false');
    self.user.find(query, function itemsFound(err, items) {
      res.render('index',{title: 'My User List ', users: items});
    });
  },


  addUser: function(req,res) {
    var self = this      
    var item = req.body.item;
    self.user.addItem(item, function itemAdded(err) {
      if(err) {
        throw err;
      }
      res.redirect('/');
    });
  },


  completeUser: function(req,res) {
    var self = this;
    var completedUsers = Object.keys(req.body);
    async.forEach(completedUsers, function userIterator(completedUser, callback){
      self.user.updateItem(completedUser, function itemsUpdated(err){
        if(err){
          callback(err);
        } else {
          callback(null);
        }
      })
    }, function(err){
      if(err) {
        throw err;
      } else {
       res.redirect('/');
      }
    });
  }
}