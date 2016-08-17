// [Node_Modules]
var fs = require('fs');

module.exports = {
	writeLog: function(logList) {
		var logName = new Date().toISOString().split("T")[0];
		try {
			// TODO: Mofidy this method to make it Async
			fs.appendFileSync('./logs/' + logName + ".json", JSON.stringify(logList), 'utf-8')
		} catch(ex) {
			console.error("##################");
			console.error("ERROR FATAL AL ESCRIBIR LOG DE ERRORES: [" + logName + "]");
			console.error(ex);
			console.error("##################");
		}
		return logName;
	}
}
