const express = require('express');
const route = express.Router();
const { readToken } = require('../helper/jwt');
const { list, activity, popular, monthlyRevenue, yearlyRevenue } = require('../controllers/transactionController');

route.get('/list', readToken, list);
route.get('/recent-activity', readToken, activity);
route.get('/monthly-revenue', readToken, monthlyRevenue);
route.get('/yearly-revenue', readToken, yearlyRevenue);
route.get('/popular-product', readToken, popular);

module.exports = route