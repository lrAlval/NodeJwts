var express = require('express'),
    _       = require('lodash'),
    config  = require('../config'),
    jwt     = require('jsonwebtoken'),
    mysql   = require("mysql");

var app = module.exports = express.Router();

function createToken(user) {
    return jwt.sign(_.omit(user, 'Password'), config.secret, { expiresIn: '24 hours' });
}

app.post('/sessions/create', function(req, res) {
    var usr = req.body.user;
    var pwd = req.body.password
    var query = "SELECT * FROM tbl_users WHERE UserID = ? AND Password = ?";

    var loggedUser = "";
    var responseStatus = "636";

    // Para este caso utilizaremos conecciones paralelas en vez del pool
    var connection = mysql.createConnection(config.conn_MySQL); 
    connection.connect();
    connection.query(query, [usr, pwd], function(err, rows, fields) {
        if (err) {
        	console.log(err)
            //res.send(err);
        } else {
            if(rows.length == 1) {
                loggedUser = rows[0];
                responseStatus = "1"
                // TODO: Agregar campo "isEnabled"
            } else {
                responseStatus = "0";
            }
        }
    });
    connection.end(function() {
		var sendResponse = {};
		switch(responseStatus) {
			case "-1":
				httpResponse = 401;
				sendResponse = {
					status 		: "-1",
					message 	: "Usuario bloqueado. Contacte al administrador"
				}
				break;
			case "0":
				httpResponse = 401;
				sendResponse = {
					status 		: "0",
					message 	: "Datos incorrectos"
				}
				break;
			case "1":
				httpResponse = 201;
				sendResponse = {
					status : "1",
					message: "OK",
					token: createToken(loggedUser),
					user: _.omit(loggedUser, ['Password', 'isRoot', 'userType', 'createdBy', 'isEnabled', 'userId'])
				}
				break;
			default:
				httpResponse = 401;
				sendResponse = {
					status : "-2",
					message: "Error general. No puede ingresar",
				}
		}
		res.status(httpResponse).send( sendResponse );

    });
});