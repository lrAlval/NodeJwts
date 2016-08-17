var pool = require('../utils/pool');
var config = require('../../config');
var _ = require('underscore');

module.exports= {
	getReportes: function(req, res) {
		pool.executeQuery({
			query: "SELECT * FROM tbl_reports ORDER BY ReportID DESC LIMIT 5",
			onConnectionError: function(err, errorID) {
				res.status(412).send({status: "-1", message: "Can't not connect to server", errID: errorID});
			},
			onQueryError: function(err, errorID) {
				console.error(err);
				res.status(412).send({status: "0", message: "Error on query trying to getReportes", errID: errorID});
			},
			onSuccess: function(result){
				res.status(200).send({status: "1", message: "OK", affectedRows: result.affectedRows});
			}
		});
	},
	addReport: function(req, res, next) {
		// ANTES: "/AddTest"y
		res.header("application/json; charset=utf-8");
		var NewData = req.body;
		console.log(NewData);
		/* Formato Del JSON Enviado por el cliente
				var NewData = {
						"Reports": {
							"Description": "dd",
							"DisconnectedUrl": "eeed",
							"Name": "nnn",
							"SendDate": "2015-11-27",
							"UserID": "admin@protisa"
						},
						"ReportsContainers": {
							"Container": "323",
							"Name": "nnn",
							"ReportID": "",
							"UserID": "admin@protisa"
						},
						"Privates": ["ANAADM", "DIJISA"]
					};
	   */

	    var Reports = 'INSERT INTO tbl_Reports  SET ? ';

		var ReportsContainers = 'INSERT INTO tbl_Reports_Containers  SET ? ';

		var PrivateContainers = 'INSERT INTO tbl_Privates_Containers(  UserID,ContainerID  )  VALUES ? ';


        pool.getConnection(function(errr, con) {
							
					con.beginTransaction(function(err) {
				    if (err) { throw err; }
				  
				    var c = con.query(Reports, NewData.Reports, function(err, result) {
				    	console.log(c.sql)
				        if (err) { return con.rollback(function() {   throw err;   }); }
				        var resReports = { vals: {}, ID: {} };
				        resReports.vals = c.values;
				        resReports.ID = result.insertId;

				        NewData.ReportsContainers.ReportID = resReports.ID;


				        var cc = con.query(ReportsContainers, NewData.ReportsContainers, function(err, result) {
				        	 console.log(cc.sql)
				            if (err) { return con.rollback(function() { throw err; });}
				            var resReportsContainers = { vals: {}, ID: {} };
				            resReportsContainers.vals = cc.values;
				            resReportsContainers.ID = result.insertId;

				            var NewPrivates = [];
				            var IDRepor = resReportsContainers.vals.ReportID;
				            var IDReportContainer = resReportsContainers.ID;


				         if (!(NewData.Privates === undefined)) {

				         	console.log("Privates Defined")

				           _.each(NewData.Privates, function (item) {
				            var NewReport = [], NewCont = [];
				                NewReport.push(item); NewReport.push(IDRepor);
				                NewCont.push(item);   NewCont.push(IDReportContainer);
				                NewPrivates.push(NewReport); NewPrivates.push(NewCont);
				           })


				         con.query(PrivateContainers, [NewPrivates], function(err, result) {
				             if (err) { return con.rollback(function() { throw err; }); }
				            con.commit(function(err) {
				                if (err) { return con.rollback(function() { throw err; }); }
				                console.log('success!');
				                res.send('Insert realizado');
				            });
				         });//Third Query


					   }else{
					   	console.log("Privates undefined")

					   		 con.commit(function(err) {
				                if (err) { return con.rollback(function() { throw err; }); }
				                console.log('success!');
				                res.send('Insert realizado');
				            });
					   }




				        });//Second Query
				    });//First Query
				    
				})//Transaction
		});


	},
    RenameReport: function(req, res, next) {
		// ANTES: "/AddTest"y
		res.header("application/json; charset=utf-8");
		var NewReport = req.body;
		console.log(NewReport);

		 var sqlReports = 'update tbl_Reports SET Name = ? where ReportID = ?'
         var sqlContainersReports = 'update tbl_reports_containers SET Name = ? where ContainerID = ?'

        pool.getConnection(function(errr, con) {
							
			con.beginTransaction(function(err) {
				    if (err) { throw err; }
				  
				    con.query(sqlReports, [NewReport.NewName, NewReport.ReportID], function(err, result) {
				        if (err) { return con.rollback(function() { throw err; }); }

				         con.query(sqlContainersReports,[NewReport.NewName, NewReport.ReportID], function(err, result) {
				            if (err) { return con.rollback(function() { throw err; });}
				         
				            con.commit(function(err) {
				                if (err) { return con.rollback(function() { throw err; }); }
				                console.log('success!');
				                res.send('RenameReport realizado');
				            });
				        });//Second Query
				    });//First Query
				    
				})//Transaction
		});


	},
	DelReport: function(req, res, next) {
		// ANTES: "/AddTest"y
		res.header("application/json; charset=utf-8");
		var ID = req.params.id;
		console.log(ID);

	    var sqlReports = 'delete from tbl_Reports  where ReportID = ?'
	    var sqlContainersReports = 'delete from tbl_reports_containers  where ContainerID = ?'

        pool.getConnection(function(errr, con) {
				con.beginTransaction(function(err) {
					    if (err) { throw err; }

					    con.query(sqlReports, ID, function(err, result) {
					        if (err) { return con.rollback(function() { throw err; }); }

					         con.query(sqlContainersReports,ID, function(err, result) {
					            if (err) { return con.rollback(function() { throw err; });}
					         
					            con.commit(function(err) {
					                if (err) { return con.rollback(function() { throw err; }); }
					                console.log('success!');
					                res.send('DelReport realizado');
					            });
					        });//Second Query
					    });//First Query
					    
					})//Transaction
		});


	},
	MovReport: function(req, res, next) {
		// ANTES: "/AddTest"y
		res.header("application/json; charset=utf-8");
		var NewReport = req.body;
		console.log(NewReport);
		
		var sqlContainersReports = 'update tbl_reports_containers set Container = ? where ContainerID = ?';

        	pool.executeQuery({
				data : [NewReport.Container, NewReport.ReportID],
				query: sqlContainersReports,
				onConnectionError: function(err, errorID) {
					res.status(412).send({status: "-1", message: "Can't not connect to server", errID: errorID});
				},
				onQueryError: function(err, errorID) {
					console.error(err);
					res.status(412).send({status: "0", message: "Error on query trying to MovReport", errID: errorID});
				},
				onSuccess: function(result){
					res.status(200).send({status: "1", message: "OK", rows: result});
				}
			});


	}
}