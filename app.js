
// /**
//  * Module dependencies.
//  */

// var express = require('express')
//   , routes = require('./routes')
//   , user = require('./routes/user')
//   , http = require('http')
//   , path = require('path');

// var app = express();

// // all environments
// app.set('port', process.env.PORT || 3000);
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
// app.use(express.favicon());
// app.use(express.logger('dev'));
// app.use(express.bodyParser());
// app.use(express.methodOverride());
// app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));

// // development only
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }

// app.get('/', routes.index);
// app.get('/users', user.list);

// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Module dependencies.
 */

var express = require('express')
  , util = require('util');
  
var fuzzy = require('fuzzy');
var y3store = require('json-store')(__dirname + '/db/new.json');
var _ = require('underscore');
var y3db = _.values(y3store.get('y3'));

// console.log(y3db);

// var y3db = require(__dirname + '/../startup/yxsg_pcgames').y3db;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var wechat = require('wechat');
var types_arr = [['英雄', '英雄'], ['物品', '物品'], ['技能', '英雄技能'], ['专属', '天命专属'], ['魂玉', '天命魂玉'], ['五行', '五行技能']];
var types_arr_r = {};
types_arr.map(function(t) { return types_arr_r[t[1]] = t[0] });

app.use(express.query());
app.use(express.logger('dev'));
app.use(
  '/wechat', 
  wechat('wx_tb_together')
    .text(function (message, req, res, next) {
      var reply_arr = [];
      console.add = function(msg) {
        console.log(msg);
        reply_arr = reply_arr || [];
        reply_arr.push(msg);
      }
      
      var q = message.Content;
      var done = 0;
      
      console.log("输入：" + q);
      
      _.each(types_arr, function(ka) {
        if (q === ka[0]) {
          console.add(wrap_name(ka[1]) + "有茫茫多情报：");
          var results = y3db.filter(function(yd) { return yd.type == ka[1]; });
          results.slice(0, 60).map(function(z) {
            console.add(z.name);
          });
          console.add("------")
          console.add("输入 夏侯惇或者xhd，即得 英雄【夏侯惇】\n输入 血影或者xylg，即得 物品【血影离光】\n");
          
          done = 1;
          // res.reply(reply_arr.join("\n"));
          // return;
        }
      });

      
      if (q === "h") {
        res.reply("其实很简单！/:rose/:rose/:rose\n输入 夏侯惇或者xhd，即得 英雄【夏侯惇】\n输入 血影或者xylg，即得 物品【血影离光】\n你也可以输入" + types_arr.map(function(z) { return wrap_name(z[0]); }).join('、') + "这些词试试！/:8-)/:8-)/:8-)");
        return;
      };
      if (q.length <= 1) {
        res.reply("请多输入几个拼音字母，让我好懂你。(提示请输入【h】)/::$");
        return;
      };
      
      if (!done) {
        var results = fuzzy.filter(q, y3db, { extract: function(el) { return el.name_zz; } });

        if (!results.length) {
          res.reply("什么也没找到/::~，是不是输入有误呢？(新英雄刘备、魏延近期加入，敬请期待！)/:8*\n------\n提示请输入【h】");
          return;
        }

        if (results.length > 5) {
          console.add("/:,@@/:,@@/:,@@/:,@@/:,@@/:,@@\n搜索到茫茫多情报：");
          results.slice(0, 15).map(function(r) {
            var z = r.original;
            console.add(wrap_name(z.type||'') + z.name);
          });
          console.add("-------");
          console.add("可否多输入几个拼音字母呢？/::P/::P/::P");
          // var lst = [];
          // lst.push({
          //   title: "搜索到" + results.length "个结果，挑一个呗？"
          // });
          // results.slice(0, 5).map(function(r) {
          //   var z = r.original;
          //   
          //   lst.push({
          //     title: z.detail,
          //     picurl: z.img_big,
          //     url: 'http://nodeapi.cloudfoundry.com/'
          //   })
          //   
          //   console.add(wrap_name(z.type||'') + z.name);
          // });
          // lst.push({
          //   title: "点击这里查看全部"
          // });
          // 
          // res.reply(lst);

          // return;
        }

        if (results.length < 6) {

          var ni = 0;

          if (results.length > 1) {
            console.add("搜索到情报" + ("零一两三四五六七八九".split(''))[results.length] + "枚：");
            ni = 1;
          }

          results.map(function(r) {
            var d = r.original;

            if (ni) {
              console.add('-------- < ' + ni + ' > --------');
            }

            if (ni < 2) {
              if (d.type === '英雄') {
                console.add(d.detail);
                console.add('-------');

                [ '派别',
                  '解锁等级' ].map(function(k) {
                    if ((d[k] || []).length) {
                      console.add(wrap_name(k) + d[k]);
                    }
                  });

                console.add('--- 英雄技能 ---');
                d['英雄技能'].map(function(zz) {
                  var zp = y3db.filter(function(yd) { return yd.name == zz.relProductName; })[0];
                  if (zp) {
                    console.add(wrap_name(zz.relProductName) + zp.detail);
                  }
                });
                console.add('--- 英雄专属 ---');
                d['英雄专属'].map(function(zz) {
                  var zp = y3db.filter(function(yd) { return yd.name == zz.relProductName; })[0];
                  console.add(wrap_name(zz.relProductName.split('（')[0]) + zp.detail);
                });
              }

              if (d.type === '物品') {
                console.add(wrap_name(d.type) + d.name);
                console.add('-------');

                [ '价格',
                  '法力值',
                  '法力回复',
                  '施法距离',
                  '移动速度',
                  '气血值',
                  '攻击力',
                  '暴击',
                  '护甲值',
                  '冷却缩减（相同装备唯一）',
                  '法术抗性',
                  '法术强度',
                  '气血回复',
                  '法术吸血',
                  '法术穿透',
                  '攻击速度',
                  '物理穿透',
                  '唯一被动' ].map(function(k) {
                    if ((d[k] || []).length) {
                      d[k].map(function(dkv) {
                        console.add(wrap_name(k) + dkv);
                      });
                    }
                  });

              }

              if (d.type === '英雄技能') {
                console.add(d.name);
                console.add('-------');
                console.add(d.detail);
                console.add('-------');
                [ '技能消耗', '冷却时间', '技能加成', '施法距离', '施法范围' ].map(function(k) {
                  if ((d[k] || []).length) {
                    console.add(wrap_name(k) + d[k]);
                  }
                });
                console.add('-------');
                console.add(wrap_name('所属英雄') + d['所属英雄']);
              }

              if (d.type === '天命专属') {
                console.add(d.name);
                console.add('-------');
                console.add(d.detail);
                console.add('-------');
                [ '攻击力',
                  '冷却缩短',
                  '升级价格',
                  '气血值',
                  '法力值',
                  '法术强度',
                  '法力恢复',
                  '物理护甲',
                  '法术抗性',
                  '暴击率',
                  '攻击速度',
                  '移动速度'].map(function(k) {
                  if ((d[k] || []).length) {
                    console.add(wrap_name(k) + d[k]);
                  }
                });
                console.add('-------');
                console.add(wrap_name('所属英雄') + d['所属英雄']);
              }

              if (d.type === '天命魂玉') {
                console.add(d.name);
                console.add('-------');
                [ '效用' ].map(function(k) {
                  if ((d[k] || []).length) {
                    console.add(wrap_name(k) + d[k]);
                  }
                });
              }
            } else {
              console.add(wrap_name(types_arr_r[d.type]) + d.name);
            }
            ni++;
          });

        }
      }
      
      var rstr = reply_arr.join("\n");
      // console.log(rstr, rstr.length);
      
      res.reply(rstr);
    })
    // .location(function (message, req, res, next) {
    //   res.reply('location');
    // })
    // .image(function (message, req, res, next) {
    //   console.log("获得消息：" + util.inspect(req.weixin));
    //   res.reply('image');
    // })
    // .voice(function (message, req, res, next) {
    //   res.reply('voice');
    // })
    // .link(function (message, req, res, next) {
    //   res.reply('link');
    // })
    .event(function (message, req, res, next) {
      var weixin = req.weixin;
      console.log("获得消息：" + util.inspect(weixin));
      if (weixin.Event == "subscribe") {
        res.reply("嗨，欢迎使用英雄三国掌中宝！/:rose/:rose/:rose\n输入 夏侯惇或者xhd，即得 英雄【夏侯惇】\n输入 血影或者xylg，即得 物品【血影离光】\n嗯，就这么简单！/:8-)/:8-)/:8-)")
      } else {
        if (weixin.Event == "unsubscribe") {
          res.reply("一定要走吗？/:P-(/:P-(，我，谢谢你！")
        };
      };
    })
    .middlewarify()
);

// Routes
function wrap_name(name) {
  return name.length ? "【" + name + "】" : ''
}

// 存储方式改变，以下暂时弃用
// app.get('/', function(req, res){
//   console.log(req.param('q'));
//   
//   var q = req.param('q') || '';
//   
//   if (q.length <= 1) {
//     res.send("不多说点什么？输入汉字或者拼音即可！");
//     return;
//   }
//   
//   var reply_arr = [];
//   console.add = function(msg) {
//     console.log(msg);
//     reply_arr = reply_arr || [];
//     reply_arr.push(msg);
//   }
//   
//   var results = fuzzy.filter(req.param('q'), y3db, { extract: function(el) { return el.first_zz; } });
//   
//   if (!results.length) {
//     res.send("什么也没找到，是不是输入有误呢？");
//     return;
//   }
//   
//   if (results.length > 10) {
//     console.log('搜索到多个结果如下：')
//     results.map(function(r) {
//       var z = r.original;
//       console.log(wrap_name(z.five||'') + z.first);
//     });
//     console.log('请多输入几个拼音字母，让我好定位到你的心。')
//     
//     res.send("搜索到多个结果，挑一个呗？");
//     return;
//   }
//   
//   if (results.length < 10) {
//     results.map(function(r) {
//       var d = r.original;
// 
//       if (d.five === '英雄') {
//         console.add(d.four);
//         console.log('-------');
//         d.third.filter(function(z) { return z.value }).map(function(k) { 
//           if (k.attrName.length)
//             console.log(wrap_name(k.attrName) + k.value);
//         });
//         console.log('-------');
//         d.citeRelations.map(function(z) {
//           console.log(z.relationName);
//           if (z.relationName === '英雄技能') {
//             z.relProducts.map(function(zz) {
//               var zp = y3db.filter(function(yd) { return yd.first == zz.relProductName; })[0];
//               console.log(wrap_name(zz.relProductName) + zp.four);
//             });
//           }
//           if (z.relationName === '英雄专属') {
//             z.relProducts.map(function(zz) {
//               var zp = y3db.filter(function(yd) { return yd.first == zz.relProductName; })[0];
//               console.log(wrap_name(zz.relProductName.split('（')[0]) + zp.four);
//             });
//           }
//         });
//       }
// 
//       if (d.five === '物品') {
//         console.log(d.first);
//         console.log('-------');
//         d.third.filter(function(z) { return z.value }).map(function(k) { 
//           if (k.attrName.length) {
//             console.log(wrap_name(k.attrName) + k.value);
//           }
//           else {
//             var va = k.value.split('：');
//             console.log(wrap_name(va[0]) + va[1]);
//           }
// 
//         });
//         console.log('-------');
// 
//         function find_children(z) {
//           if (z.relProducts && z.relProducts.length)
//             z.relProducts.map(function(zz) {
//               var zp = y3db.filter(function(yd) { return yd.first == zz.relProductName; })[0];
//               console.log(wrap_name(zz.relProductName) + zp.third[0].value);
//               find_children(zp);
//             });
//         }
// 
//         d.citeRelations.map(function(z) {
//           console.log(z.relationName);
//           find_children(z);
//         });
//         
//       }
// 
//       if (d.five === '英雄技能') {
//         console.log(wrap_name(d.five) + d.first);
//         console.log('-------');
//         d.third.filter(function(z) { return z.value }).map(function(k) { 
//           if (k.attrName.length) {
//             console.log(wrap_name(k.attrName) + k.value);
//           }
//           else {
//             var va = k.value.split('：');
//             console.log(wrap_name(va[0]) + va[1]);
//           }
// 
//         });
//         console.log('-------');
//         d.citeRelations.map(function(z) {
//           console.log(z.relationName);
//           z.relProducts.map(function(zz) {
//             var zp = y3db.filter(function(yd) { return yd.first == zz.relProductName; })[0];
//             console.log(wrap_name(zz.relProductName) + zp.four);
//           });
//         });
//       }
//       
//       console.log('----------------------');
//       
//     });
//   }
// 
//   console.log(reply_arr);
// 
//   res.send(results.map(function(z) { return z.string }).join(' | '));
// });


app.listen(process.env.VCAP_APP_PORT || 22011, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
