// [HandyCraft]
var pool = require('../utils/pool');

module.exports= {
	addVista: function(req, res) {

		// TODO: Me parece que debemos considerar el timeoffset, ya que estamos en GMT-5. Hay que probar que tenemos en el otro servidor de EEUU
		var dateAndTime = new Date().toISOString().split("T");
		var insertBody = {
			userID		: req.user.UserID,
			reportID	: req.body.reportID,
			viewdate	: dateAndTime[0],
			viewtime	: dateAndTime[1].split(".")[0],
			ip			: req.headers['x-forwarded-for'] || req.connection.remoteAddress
		}

		if(req.user.UserID && req.body.reportID) {
			pool.executeQuery({
				data : insertBody,
				query: "INSERT INTO tbl_views SET ?",
				onConnectionError: function(err, errorID) {
					res.status(412).send({status: "-1", message: "Can't not connect to server", errID: errorID});
				},
				onQueryError: function(err, errorID) {
					console.error(err);
					res.status(412).send({status: "0", message: "Error on query trying to find vistas", errID: errorID});
				},
				onSuccess: function(result){
					res.status(200).send({status: "1", message: "OK", affectedRows: result.affectedRows});
				}
			});
		} else {
			res.status(412).send({status: "-1", message: "Required data wasn't provided when trying to add vista", });
		}
		
	}
}
