/**
 * Created by licongyu on 16/5/12.
 */
var redis = require('./redis');
var _ = require('lodash');

var get = function(key, callback){
    var d = new Date();
    redis.get(key, function(err, data){
        //console.log(redis.keys('*'));
        if (err) {
            return callback(err);
        }
        if (!data) {
            return callback();
        }
        data = JSON.parse(data);

        callback(null, data);
    });
};

exports.get = get;

var set = function(key, value, time, callback){
    var d = new Date();

    if (typeof time === 'function') {
        callback = time;
        time = null;
    }

    callback = callback || _.noop;
    value = JSON.stringify(value);

    if(!time){
        redis.set(key, value, callback);
    }else{
        redis.setex(key, time, value, callback);
    }
};

exports.set = set;

