const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const {login, register, keeplogin} = require('../controllers/userController');
const {readToken} = require('../helper/jwt');

route.post('/auth', login);
route.get('/keeplogin', readToken, keeplogin);
route.post('/register', readToken, register);

module.exports = route