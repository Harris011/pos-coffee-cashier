const express = require('express');
const route = express.Router();
const { readToken } = require('../helper/jwt');
const { list, create, edit, drop, categoryList } = require('../controllers/categoryController');
const { checkCategory, checkCategoryUpdate } = require('../helper/validator');

route.get('/list', readToken, list);
route.post('/create', readToken, checkCategory, create);
route.patch('/edit/:id', readToken, checkCategoryUpdate, edit);
route.patch('/delete/:id', readToken, drop);
route.get('/category-list', readToken, categoryList);

module.exports = route