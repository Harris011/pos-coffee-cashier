const express = require('express');
const route = express.Router();
const {readToken} = require('../helper/jwt');
const { list } = require('../controllers/categoryController');

route.get('/list', readToken, list);

module.exports = route