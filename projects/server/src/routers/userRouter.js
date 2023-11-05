const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const { login, register, keeplogin, edit, drop, reset, userList, roleList, userCount } = require('../controllers/userController');
const { readToken } = require('../helper/jwt');
const { checkUser, checkResetPassword, checkUserUpdate } = require('../helper/validator');

route.post('/auth', checkUser, login);
route.get('/keeplogin', readToken, keeplogin);
route.post('/register', readToken, checkUser, register);
route.patch('/edit/:uuid', readToken, checkUserUpdate, edit);
route.patch('/reset-password/:uuid', readToken, checkResetPassword, reset);
route.patch('/delete/:uuid', readToken, drop);
route.get('/user-list', readToken, userList);
route.get('/role-list', readToken, roleList);
route.get('/count', readToken, userCount);

module.exports = route