
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 19211);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
// app.get('/wechat', routes.index);




var wechat = require('wechat');

app.use(express.query());
app.use('/wechat', wechat('wx2', function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin;

  if (message.Content === "h") {
        res.reply("其实很简单！/:rose/:rose/:rose\n输入 夏侯惇或者xhd，即得 英雄【夏侯惇】\n输入 血影或者xylg，即得 物品【血影离光】\n你也可以输入" + types_arr.map(function(z) { return wrap_name(z[0]); }).join('、') + "这些词试试！/:8-)/:8-)/:8-)");
        return;
      };

  // if (message.FromUserName === 'diaosi') {
  //   // 回复屌丝(普通回复)
  //   res.reply('hehe');
  // } else if (message.FromUserName === 'text') {
  //   //你也可以这样回复text类型的信息
  //   res.reply({
  //     content: 'text object',
  //     type: 'text'
  //   });
  // } else if (message.FromUserName === 'hehe') {
  //   // 回复一段音乐
  //   res.reply({
  //     title: "来段音乐吧",
  //     description: "一无所有",
  //     musicUrl: "http://mp3.com/xx.mp3",
  //     hqMusicUrl: "http://mp3.com/xx.mp3"
  //   });
  // } else {
  //   // 回复高富帅(图文回复)
  //   res.reply([
  //     {
  //       title: '你来我家接我吧',
  //       description: '这是女神与高富帅之间的对话',
  //       picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
  //       url: 'http://nodeapi.cloudfoundry.com/'
  //     }
  //   ]);
  // }
}));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});