/*
	Reference: [http://stackoverflow.com/questions/18496540/node-js-mysql-connection-pooling]
	You still have to write getConnection every time. But you could save the connection in the module the first time you get it.

*/
// [Node_Modules]
var mysql = require('mysql');

// [HandyCraft]
var config = require('../../config');
var logger = require('./logger');

var pool = mysql.createPool(config.conn_MySQL);

module.exports = {
    getConnection: function(cb) {
        pool.getConnection(function(err, connection) {
            cb(err, connection);
        });
    },
    end: function(cb) {
        pool.end(function(err) {

            /*
            	Reference: [https://www.npmjs.com/package/mysql#closing-all-the-connections-in-a-pool]

            	The end method takes an optional callback that you can use to know once all the connections have ended. 
            	The connections end gracefully, so all pending queries will still complete and the time to end the pool will vary.

            	Once pool.end() has been called, pool.getConnection and other operations can no longer be performed
            */

            cb(err);

        });
    },
    executeQuery: function(options) {
        /*
        	options: {
        		data : object || array || string -> optional
        		query: string
        		onConnectionError: function(err) {
        	
        		},
        		onQueryError: function(err) {
        	
        		},
        		onSuccess: function(result){

        			// Reference: [https://www.npmjs.com/package/mysql#getting-the-id-of-an-inserted-row]
        			// (And bellow)
        			
        			// When dealing with big numbers (above JavaScript Number precision limit), 
        			// you should consider enabling supportBigNumbers option to be able to read the insert id as a string, otherwise it will throw.
        			// This option is also required when fetching big numbers from the database, 
        			// otherwise you will get values rounded to hundreds or thousands due to the precision limit.
        			// [result.insertId]

        			// You can get the number of affected rows from an insert, update or delete statement.
        			// [result.affectedRows]

        			// "changedRows" differs from "affectedRows" in that it does not count updated rows whose values were not changed.
        			// [result.changedRows]
        			
        		}
        		// ###### IMPORTANT!: "onConnectionError", "onQueryError" and "onSuccess" are exclusive and procedural.
        		// It means if "onConnectionError" is triggered the rest of functions won't
        	}
        */
        pool.getConnection(function(err, connection) {
            if (err) {
                var errID = logger.writeLog(err);
                options.onConnectionError(err, errID);
                return;
            }

            if (options.data) {
                connection.query(options.query, options.data, function(err, result) {
                    connection.release();
                    if (err) {
                        var errID = logger.writeLog(err);
                        options.onQueryError(err, errID);
                        return;
                    }
                    options.onSuccess(result);
                });
            } else {
                connection.query(options.query, function(err, result) {
                    connection.release();
                    if (err) {
                        var errID = logger.writeLog(err);
                        options.onQueryError(err, errID);
                        return;
                    }
                    options.onSuccess(result);
                });
            }



        });

    },
    QueryPromise: function(options) {
        /*
        	options: {
        		data : object || array || string -> optional
        		query: string
        		onConnectionError: function(err) {
        	
        		},
        		onQueryError: function(err) {
        	
        		},
        		onSuccess: function(result){

        			// Reference: [https://www.npmjs.com/package/mysql#getting-the-id-of-an-inserted-row]
        			// (And bellow)
        			
        			// When dealing with big numbers (above JavaScript Number precision limit), 
        			// you should consider enabling supportBigNumbers option to be able to read the insert id as a string, otherwise it will throw.
        			// This option is also required when fetching big numbers from the database, 
        			// otherwise you will get values rounded to hundreds or thousands due to the precision limit.
        			// [result.insertId]

        			// You can get the number of affected rows from an insert, update or delete statement.
        			// [result.affectedRows]

        			// "changedRows" differs from "affectedRows" in that it does not count updated rows whose values were not changed.
        			// [result.changedRows]
        			
        		}
        		// ###### IMPORTANT!: "onConnectionError", "onQueryError" and "onSuccess" are exclusive and procedural.
        		// It means if "onConnectionError" is triggered the rest of functions won't
        	}
        */
        pool.getConnection(function(err, connection) {

            var newRes = {
                vals: {},
                ID: {}
            };


            return new Promise(function(resolve, reject) {

                if (err) {
                    var errID = logger.writeLog(err);
                    options.onConnectionError(err, errID);
                    return;
                }
                if (options.data) {
                    var c = connection.query(options.query, options.data, function(err, result) {
                        connection.release();
                        if (err) {
                            var errID = logger.writeLog(err);
                            options.onQueryError(err, errID);
                            reject(err);
                            return;
                        }
				 			newRes.vals = c.values;
				            newRes.ID = result.insertId;
				            resolve(newRes);

                        options.onSuccess(result);
                    });
                } 


            });





        });

    },


















};
