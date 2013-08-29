
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: y3db[0].first })
};