
// [HandyCraft]
var pool = require('../utils/pool');

module.exports= {
	getUsers: function(req, res) {
			pool.executeQuery({
				query: "select * from tbl_users",
				onConnectionError: function(err, errorID) {
					res.status(412).send({status: "-1", message: "Can't not connect to server", errID: errorID});
				},
				onQueryError: function(err, errorID) {
					console.error(err);
					res.status(412).send({status: "0", message: "Error on query trying to getUsers", errID: errorID});
				},
				onSuccess: function(result){
					res.status(200).send({status: "1", message: "OK", rows: result});
				}
			});
	}
	
}