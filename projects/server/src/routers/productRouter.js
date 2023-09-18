const express = require('express');
const route = express.Router();
const {readToken} = require('../helper/jwt');
const uploader = require('../helper/uploader');
const { list, create, drop, edit, productList } = require('../controllers/productController');

route.get('/list', readToken, list);
route.post('/create', readToken, uploader('/imgProduct', 'PRD').array('images',1), create);
route.patch('/edit/:uuid', readToken, uploader('/imgProduct', 'PRD').array('images',1), edit);
route.patch('/delete/:uuid', readToken, drop);
route.get('/product-list', readToken, productList);

module.exports = route