// [HandyCraft]

var pool = require('../utils/pool');
var config = require('../../config');
var _ = require('underscore');
//var mysql = require('mysql');
//var con = mysql.createConnection(config.conn_MySQL);




module.exports= {
	findPrivates: function(req, res) {

		var id = req.params.id;
		var Admins = config.admins;
		var sql;

		console.log(Admins)
		console.log(id)

		// TODO: Build a Mysql-Function to validata a user and select privatesContainers 
		// DISTINCT: Just in case
		if (Admins.indexOf(id) > -1) {
			sql = ' SELECT DISTINCT UserID, ContainerID FROM tbl_Privates_Containers;';	
		} else {
			sql = ' SELECT DISTINCT UserID, ContainerID  FROM tbl_Privates_Containers WHERE UserID = ? ';	
		} 

		if(id) {
			pool.executeQuery({
				data : id,
				query: sql,
				onConnectionError: function(err, errorID) {
					res.status(412).send({status: "-1", message: "Can't not connect to server", errID: errorID});
				},
				onQueryError: function(err, errorID) {
					console.error(err);
					res.status(412).send({status: "0", message: "Error on query trying to find private", errID: errorID});
				},
				onSuccess: function(result){
					res.status(200).send({status: "1", message: "OK", rows: result});
				}
			});
		} else {
			res.status(412).send({status: "-1", message: "Required data wasn't provided when trying to find private" });
		}
	},
	addPermisos: function(req, res) {
		// TODO: Validata this function, ContainerID and UserID could be undefined
		var NewPermission = req.body.Arr;
		pool.executeQuery({
			data : [NewPermission],
			query: "INSERT INTO tbl_Privates_Containers( ContainerID, UserID  )  VALUES ? ",
			onConnectionError: function(err, errorID) {
				res.status(412).send({status: "-1", message: "Can't not connect to server", errID: errorID});
			},
			onQueryError: function(err, errorID) {
				console.error(err);
				res.status(412).send({status: "0", message: "Error on query trying to add permisos", errID: errorID});
			},
			onSuccess: function(result){
				res.status(200).send({status: "1", message: "OK", affectedRows: result.affectedRows});
			}
		});
	},
	getContainers:function  (req,res) {
		var User = req.params.id;
		var sql = 'SELECT ' + ' RC.ContainerID, ' + ' RC.NAME AS ContainerName, ' + ' R.senddate AS Fecha, ' + ' R.description, ' + ' R.PreviewPath, ' + ' V.views, ' + ' IFNULL(F.favoriteid, false) AS isFavorite, ' + ' RC.Container, ' + ' R.DisconnectedUrl AS Url, ' + ' R.ReportID, ' + ' R.filepath AS subUrl, ' + ' RC.relevancia, ' + '  RC.orden ' + 'FROM ' + 'tbl_reports_containers AS RC ' + 'INNER JOIN ' + ' tbl_reports AS R ON RC.ReportID = R.ReportID ' + '    LEFT JOIN ' + 'tbl_favorites AS F ON F.ReportID = RC.ReportID ' + '    LEFT JOIN ' + ' (SELECT  ' + '    ReportID, COUNT(UserID) AS views ' + 'FROM ' + '   tbl_views ' + 'WHERE ' + '    UserID = ? ' + 'GROUP BY ReportID) AS V ON V.ReportID = RC.ReportID ' + 'WHERE ' + ' RC.UserID = ?  ' + '       UNION  ' + 'SELECT  ' + ' RC.ContainerID, ' + 'RC.NAME AS ContainerName, ' + 'R.senddate AS Fecha, ' + ' R.description, ' + ' R.PreviewPath, ' + ' V.views, ' + ' IFNULL(F.favoriteid, FALSE) AS isFavorite, ' + ' RC.Container, ' + ' R.disconnectedurl AS Url, ' + ' R.ReportID, ' + ' R.filepath AS subUrl, ' + ' RC.relevancia, ' + ' RC.orden ' + 'FROM ' + 'tbl_Reports_Containers AS RC ' + '    INNER JOIN ' + 'tbl_Reports AS R ON RC.ReportID = R.ReportID ' + '    INNER JOIN ' + 'tbl_Privates_Containers AS PC ON PC.ContainerID = RC.ContainerID ' + '    LEFT JOIN ' + 'tbl_favorites AS F ON F.ReportID = RC.ReportID ' + '    LEFT JOIN ' + '(SELECT  ' + '    ReportID, COUNT(userid) AS views ' + 'FROM ' + '    tbl_views ' + 'WHERE ' + '    userid = ? ' + 'GROUP BY reportid) AS V ON V.reportid = RC.reportid ' + 'WHERE ' + ' PC.userid = ? ' + 'ORDER BY ContainerID ASC ';

		// TODO: Build a Mysql-Function to validata a user and select privatesContainers 
		// DISTINCT: Just in case
		if(User) {
			pool.executeQuery({
				data : [User, User, User,User],
				query: sql,
				onConnectionError: function(err, errorID) {
					res.status(412).send({status: "-1", message: "Can't not connect to server", errID: errorID});
				},
				onQueryError: function(err, errorID) {
					console.error(err);
					res.status(412).send({status: "0", message: "Error on query trying to getContainers", errID: errorID});
				},
				onSuccess: function(result){
					res.status(200).send({status: "1", message: "OK", rows: result});
				}
			});
		} else {
			res.status(412).send({status: "-1", message: "Required data wasn't provided when trying to getContainers" });
		}

	},
	RemovePermisos: function(req, res) {
		var id = req.params.id;
		pool.executeQuery({
		    "data":id,
			query: "DELETE FROM tbl_Privates_Containers WHERE UserID = ?",
			onConnectionError: function(err, errorID) {
				res.status(412).send({status: "-1", message: "Can't not connect to server", errID: errorID});
			},
			onQueryError: function(err, errorID) {
				console.error(err);
				res.status(412).send({status: "0", message: "Error on query trying to RemovePermisos", errID: errorID});
			},
			onSuccess: function(result){
				res.status(200).send({status: "1", message: "OK", affectedRows: result.affectedRows});
			}
		});
	}
	
}
