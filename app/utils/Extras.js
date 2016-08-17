var mysql = require('mysql');
var logger = require('./logger');
var pool  = mysql.createPool(config.conn_MySQL);
var config  = require('../../config');
var Extras = module.exports = {};




pool.getConnection(function(err, connection) {


});















Extras.Insert = function(sql, data) {

    var newRes = {
        vals: {},
        ID: {}
    };

    return new Promise(function(resolve, reject) {
        var c = con.query(sql, data, function(err, result) {
            if (err) reject(err);
            newRes.vals = c.values;
            newRes.ID = result.insertId;
            resolve(newRes);
        });

    });




    
}
