const express = require('express');
const routeur = express.Router()
const controller = require('../controller/controller');


routeur.get('/login', controller.getLogin);
routeur.get('/register', controller.getRegister);
routeur.post('/login', controller.postLogin);
routeur.post('/register', controller.postRegister);
routeur.get('/home', controller.getHome);
routeur.get('/loading', controller.getLoading);
routeur.get('/game', controller.getGame);
routeur.get('/logout', controller.getLogout);

module.exports = routeur;