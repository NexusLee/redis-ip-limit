/**
 * Created by licongyu on 16/5/12.
 */
var db = require("../../config/db");
var Redis = require("ioredis");

var redis = new Redis();
var keys = redis.keys('*');
//console.log(keys);

var client = new Redis({
    port: db.redis_port,
    host: db.redis_host,
    db: db.redis_db
});

exports = module.exports = client;