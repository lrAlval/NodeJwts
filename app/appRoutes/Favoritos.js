
// [HandyCraft]
var pool = require('../utils/pool');

module.exports= {
	findFavorites: function(req, res) {

		if(req.params.id) {
			pool.executeQuery({
				data : req.params.id,
				query: "SELECT * FROM tbl_favorites WHERE UserID = ?",
				onConnectionError: function(err, errorID) {
					res.status(412).send({status: "-1", message: "Can't not connect to server", errID: errorID});
				},
				onQueryError: function(err, errorID) {
					console.error(err);
					res.status(412).send({status: "0", message: "Error on query trying to find favorites", errID: errorID});
				},
				onSuccess: function(result){
					res.status(200).send({status: "1", message: "OK", rows: result});
				}
			});
		} else {
			res.status(412).send({status: "-1", message: "Required data wasn't provided when trying to find favorites", });
		}
		
	},
	addFavorite: function(req, res) {
		var NewFavorite = req.body;
		console.log(NewFavorite);

		pool.executeQuery({
			data : NewFavorite,
			query: "INSERT INTO tbl_favorites  SET ?",
			onConnectionError: function(err, errorID) {
				res.status(412).send({status: "-1", message: "Can't not connect to server", errID: errorID});
			},
			onQueryError: function(err, errorID) {
				res.status(412).send({status: "0", message: "Error on query trying to insert new favorite", errID: errorID});
			},
			onSuccess: function(result) {
				res.status(200).send({status: "1", message: "OK", affectedRows: result.affectedRows});
			}
		});
	},
	removeFavorite: function(req, res) {

		if(req.params.id) {
			pool.executeQuery({
				data : req.params.id,
				query: "DELETE FROM tbl_favorites WHERE FavoriteID = ?", // En la fuente decía "ReportID = ?" ... Eso hubiera borrado todos los favoritos de todos los usuarios que lo hubieran marcado como favorito
				onConnectionError: function(err, errorID) {
					res.status(412).send({status: "-1", message: "Can't not connect to server", errID: errorID});
				},
				onQueryError: function(err, errorID) {
					res.status(412).send({status: "0", message: "Error on query trying to insert new favorite", errID: errorID});
				},
				onSuccess: function(result) {
					res.status(200).send({status: "1", message: "OK", affectedRows: result.affectedRows});
				}
			});
		} else {
			res.status(412).send({status: "-1", message: "Required data wasn't provided when trying to remove favorite", });
		}
		
	}
}

