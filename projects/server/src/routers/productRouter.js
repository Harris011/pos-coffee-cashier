const express = require('express');
const route = express.Router();
const {readToken} = require('../helper/jwt');
const uploader = require('../helper/uploader');
const { list, create, drop, edit, productList } = require('../controllers/productController');
const {checkProduct, checkProductUpdate} = require('../helper/validator');

route.get('/list', readToken, list);
route.post('/create', readToken, uploader('/imgProduct', 'PRD').array('images',1), checkProduct, create);
route.patch('/edit/:uuid', readToken, uploader('/imgProduct', 'PRD').array('images',1), checkProductUpdate, edit);
route.patch('/delete/:uuid', readToken, drop);
route.get('/product-list', readToken, productList);

module.exports = route