var app = require("../server.js").app
	, conf = app.get("conf")
    , azure = require('azure')
    , async = require('async')
    , User = require('../models/user.js');

var user = new User(
    azure.createTableService(conf.get("STORAGE_NAME"), conf.get("STORAGE_KEY"))
    , conf.get("TABLE_NAME")
    , conf.get("PARTITION_KEY"));

exports.index = function(req, res) {
	var query = azure.TableQuery
      .select()
      .from(user.tableName)
      .where('FacebookID eq ?', '4');

    user.find(query, function (err, items) {
		console.log("found query", items, "err", err);
		if (!err) {
			if (items.length) {
				console.log("Items found ", items);	
				res.send("Found user!" + items.length);
			}
			else {
				var item = {
					"Name": "First User",
					"FacebookID": "4",
					"FacebookAccessToken": "NotAvailable"
				};
				user.addItem(item, function(err) {
					if (err) {
						res.send("Error occurred while adding", err);	
					}
					else {
						res.send("Added user!", item);
					}
				});
			}
		}
		else {
			res.send("Error occurred ", err);	
		}
    });
};