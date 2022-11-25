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
const TransactionModel = require('../database/models/transaction.model');
const AccountModel = require('../database/models/account.model');
const UserModel = require('../database/models/user.model');
const { Op } = require("sequelize");
const getAllTransactions = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield TransactionModel.findAll({
            where: {
                [Op.or]: [
                    { debitedAccountId: accountId },
                    { creditedAccountId: accountId }
                ]
            }
        });
        return result;
    }
    catch (err) {
        console.log(err);
    }
});
const makeTransaction = (originAccId, otherUserName, opValue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSearch = yield UserModel.findOne({ where: { username: otherUserName } }, { raw: true });
        if (!userSearch)
            return ('Operação não realizada, usuário de destino não encontrado!');
        const { accountId: otherAccId } = userSearch;
        const result1 = yield AccountModel.decrement({ balance: opValue }, { where: { id: originAccId } });
        const result = yield AccountModel.increment({ balance: opValue }, { where: { id: otherAccId } });
        const trans = yield TransactionModel.create({ debitedAccountId: originAccId, creditedAccountId: otherAccId, value: opValue });
        return true;
    }
    catch (err) {
        console.log(err);
    }
});
module.exports = {
    getAllTransactions, makeTransaction
};
