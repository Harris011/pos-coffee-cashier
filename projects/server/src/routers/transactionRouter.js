const express = require('express');
const route = express.Router();
const { readToken } = require('../helper/jwt');
const { list, activity, popular, monthlyRevenue, yearlyRevenue, create, pay, latestTransactions, details } = require('../controllers/transactionController');

route.get('/list', readToken, list);
route.get('/recent-activity', readToken, activity);
route.get('/monthly-revenue', readToken, monthlyRevenue);
route.get('/yearly-revenue', readToken, yearlyRevenue);
route.get('/popular-product', readToken, popular);
route.post('/create', readToken, create);
route.get('/latest-transactions', readToken, latestTransactions);
route.patch('/pay/:id', readToken, pay);
route.get('/details/:id', readToken, details);

module.exports = route