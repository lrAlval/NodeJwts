var express = require('express'),
    jwt = require('express-jwt'),
    config = require('../config'),
    fs = require('fs'),
    _ = require('underscore'),

Favoritos = require("./appRoutes/Favoritos");
Vistas = require("./appRoutes/Vistas");
Historial = require("./appRoutes/Historial");
Containers = require("./appRoutes/PrivateContainers");
Reports = require("./appRoutes/Reports");
Folders = require("./appRoutes/Folders");
Usuarios = require("./appRoutes/Usuarios");



var app = module.exports = express.Router();

var jwtCheck = jwt({
    secret: config.secret
});

app.use('/api/protected', jwtCheck);




app.get('/api/protected/getContainers/:id', Containers.getContainers);
app.get('/api/protected/favoritos/:id', Favoritos.findFavorites);
app.get('/api/protected/Private/:id', Containers.findPrivates);
app.get("/api/protected/historial/:user", Historial.findHistorial);
app.get('/api/protected/getReportes/', Reports.getReportes);
app.get('/api/protected/Usuarios', Usuarios.getUsers);


app.post('/api/protected/addFavorite', Favoritos.addFavorite);
app.delete('/api/protected/removeFavorite/:id', Favoritos.removeFavorite);



//Containers
app.post('/api/protected/addPermisos/', Containers.addPermisos);
app.delete('/api/protected/RemovePermisos/:id', Containers.RemovePermisos);


//Reports
app.post('/api/protected/addReport/', Reports.addReport);
app.put('/api/protected/RenameReport/', Reports.RenameReport);
app.delete('/api/protected/DelReport/:id', Reports.DelReport);
app.put('/api/protected/MovReport/', Reports.MovReport);



app.post('/api/protected/addVista', Vistas.addVista);