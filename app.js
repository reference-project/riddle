
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

// app.use(express.cookieParser());
// app.use(express.session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));
// app.use('/wechat', wechat('some token', wechat.text(function (info, req, res, next) {
//   console.log(info);
//   console.log(req);
//   console.log(res);
//   if (info.Content === '=') {
//     var exp = req.wxsession.text.join('');
//     req.wxsession.text = '';
//     res.reply(exp);
//     console.log(exp);
//   } else {
//     req.wxsession.text = req.wxsession.text || [];
//     req.wxsession.text.push(info.Content);
//     res.reply('收到' + info.Content);
//     console.log(info.Content);
//   }
// })));


app.use('/wechat', wechat('wx2', wechat.text(function (message, req, res, next) {
  // message为文本内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125035',
  // MsgType: 'text',
  // Content: 'http',
  // MsgId: '5837397576500011341' }
  if (message.Content === "h") {
    res.reply("热烈欢迎！8-)");
    return;
  };

}).image(function (message, req, res, next) {
  // message为图片内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359124971',
  // MsgType: 'image',
  // PicUrl: 'http://mmsns.qpic.cn/mmsns/bfc815ygvIWcaaZlEXJV7NzhmA3Y2fc4eBOxLjpPI60Q1Q6ibYicwg/0',
  // MsgId: '5837397301622104395' }
}).location(function (message, req, res, next) {
  // message为位置内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125311',
  // MsgType: 'location',
  // Location_X: '30.283950',
  // Location_Y: '120.063139',
  // Scale: '15',
  // Label: {},
  // MsgId: '5837398761910985062' }
}).voice(function (message, req, res, next) {
  // message为音频内容
  // 微信官方还未正式开放音频内容，但是可以获取到部分信息，内容如下：
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'voice',
  // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
  // Format: 'amr',
  // MsgId: '5837397520665436492' }
    res.reply([
      {
        title: '猜品牌第一弹★★★★☆',
        description: 'A、这是美女 B、这是美女 C、这是美女',
        picurl: 'http://img.xiami.com/images/artistpic/17/7117/1377164234_ZhoS_4.jpg',
        url: 'http://www.xiami.com'
      }
    ]);
}).link(function (message, req, res, next) {
  // message为链接内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'link',
  // Title: '公众平台官网链接',
  // Description: '公众平台官网链接',
  // Url: 'http://1024.com/',
  // MsgId: '5837397520665436492' }
}).event(function (message, req, res, next) {
  // message为事件内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'event',
  // Event: 'LOCATION',
  // Latitude: '23.137466',
  // Longitude: '113.352425',
  // Precision: '119.385040',
  // MsgId: '5837397520665436492' }
  if (message.Event == "subscribe") {
    res.reply([
      {
        title: '猜品牌第一弹★★★★☆',
        description: 'A、这是美女 B、这是美女 C、这是美女',
        picurl: 'http://img.xiami.com/images/artistpic/17/7117/1377164234_ZhoS_4.jpg',
        url: 'http://www.xiami.com'
      }
    ]);
  };
})));
//--------------

// app.use('/wechat', wechat('wx2', function (req, res, next) {
//   // 微信输入信息都在req.weixin上
//   var message = req.weixin;

//   if (message.Content === "h") {
//         res.reply("热烈欢迎！");
//         return;
//       };

//   // if (message.FromUserName === 'diaosi') {
//   //   // 回复屌丝(普通回复)
//   //   res.reply('hehe');
//   // } else if (message.FromUserName === 'text') {
//   //   //你也可以这样回复text类型的信息
//   //   res.reply({
//   //     content: 'text object',
//   //     type: 'text'
//   //   });
//   // } else if (message.FromUserName === 'hehe') {
//   //   // 回复一段音乐
//   //   res.reply({
//   //     title: "来段音乐吧",
//   //     description: "一无所有",
//   //     musicUrl: "http://mp3.com/xx.mp3",
//   //     hqMusicUrl: "http://mp3.com/xx.mp3"
//   //   });
//   // } else {
//   //   // 回复高富帅(图文回复)
//   //   res.reply([
//   //     {
//   //       title: '你来我家接我吧',
//   //       description: '这是女神与高富帅之间的对话',
//   //       picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
//   //       url: 'http://nodeapi.cloudfoundry.com/'
//   //     }
//   //   ]);
//   // }
// }));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});