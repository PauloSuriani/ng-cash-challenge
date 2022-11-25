"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TransactionService = require('../services/transaction');
const getAllTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.body;
    console.log('acc id: ', accountId);
    try {
        if (accountId) {
            const result = yield TransactionService.getAllTransactions(accountId);
            res.status(200).send(result);
        }
    }
    catch (err) {
        next(err);
    }
});
const makeTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId: originAccId } = req.body;
    const { username: otherUserName } = req.body;
    const { value: opValue } = req.body;
    try {
        const result = yield TransactionService.makeTransaction(originAccId, otherUserName, opValue);
        if (result === true) {
            res.status(201).send({ "status": "201" });
        }
        if (result.includes('não realizada')) {
            res.status(403).send('"Operação não realizada, usuário de destino não encontrado!"');
        }
    }
    catch (err) {
        console.log(err);
    }
});
module.exports = {
    getAllTransactions, makeTransaction
};
