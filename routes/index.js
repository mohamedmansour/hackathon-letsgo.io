
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


exports.tos = function(req, res){
  res.render('tos');
};


exports.support = function(req, res){
  res.render('support');
};


exports.privacy = function(req, res){
  res.render('privacy');
};