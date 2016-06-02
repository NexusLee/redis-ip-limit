var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');
var express = require('express');
var app = express();
var partials = require('express-partials');
var t = require('./app/common/t');
var Redis = require("ioredis");
var async = require("async")

//app.set('views', './app/views');
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

app.use(function (req, res, next) {
    var d = new Date().getTime();
    var redis = new Redis();
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var count = 0;
    redis.keys(ip + "*", function(err, rows) {
        async.each(rows, function(row, callback) {
            //redis.del(row, function(){

            //})

            var arr = row.split(ip), timestamp = parseInt(arr[1]);
            if(((d - timestamp) / 1000) < 60){
                count++;
            }

            callback(null);

        }, function(err){
            if( err ) {
                console.log(err)
            } else {
                console.log(count)
                if(count < 5){
                    t.set(ip + d, "1", 300, function(err, data){
                        if(err){
                            console.log(err);
                        }
                    });
                    next();
                }else{
                    console.log("服务器拒绝")
                    return;
                }
            }
        })
    });

    /*var d = new Date().getTime();
    var key = req.header('x-forwarded-for') || req.connection.remoteAddress;
    t.get(key, function(err, data){
        if(err){
            console.log(err);
        }
        console.log(data);
    });*/
    /*t.set(ip + d, "1", 300, function(err, data){
        if(err){
            console.log(err);
        }
    });*/
});

app.get('/', function (req, res) {
    //res.render('index', { title: 'Express' });
    console.log("1234");
});

app.listen(port);

console.log("程序运行在 " + host + ":" + port);

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

