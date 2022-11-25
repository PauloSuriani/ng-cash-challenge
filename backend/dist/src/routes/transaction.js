"use strict";
var { Router } = require('express');
var router = Router();
const TransactionController = require('../controllers/transaction');
router.route('/transactions').post(TransactionController.getAllTransactions);
router.route('/operation').post(TransactionController.makeTransaction);
module.exports = router;
