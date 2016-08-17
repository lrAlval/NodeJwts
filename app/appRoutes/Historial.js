
// [HandyCraft]
var pool = require('../utils/pool');

module.exports= {
	findHistorial: function(req, res) {

		var sql = 'SELECT ReportName, Generado , Hora, Path, ContainerID ' + 
				  ' FROM tbl_historial ORDER BY IDHist DESC';

		if(req.params.user) {
			pool.executeQuery({
				data : req.params.id,
				query: sql,
				onConnectionError: function(err, errorID) {
					res.status(412).send({status: "-1", message: "Can't not connect to server", errID: errorID});
				},
				onQueryError: function(err, errorID) {
					console.error(err);
					res.status(412).send({status: "0", message: "Error on query trying to find historial", errID: errorID});
				},
				onSuccess: function(result){
					res.status(200).send({status: "1", message: "OK", rows: result});
				}
			});
		} else {
			res.status(412).send({status: "-1", message: "Required data wasn't provided when trying to find historial", });
		}
		
	}
}
