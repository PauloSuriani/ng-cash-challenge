const TransactionModel = require('../database/models/transaction.model');
const AccountModel = require('../database/models/account.model');
const UserModel = require('../database/models/user.model');
const { Op } = require("sequelize");

const getAllTransactions = async (accountId: number) => {
	try {
		const result = await TransactionModel.findAll({
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
}

const makeTransaction = async (originAccId: number, otherUserName: string, opValue: number) => {
	try {
		const userSearch = await UserModel.findOne({ where: { username: otherUserName } }, { raw: true });
		if (!userSearch) return ('Operação não realizada, usuário de destino não encontrado!');
	
		const { accountId: otherAccId } = userSearch;

		const result1 = await AccountModel.decrement(
			{ balance: opValue },
			{ where: { id: originAccId } }
		);

		const result = await AccountModel.increment(
			{ balance: opValue },
			{ where: { id: otherAccId } }
		);

		const trans = await TransactionModel.create(
			{ debitedAccountId: originAccId, creditedAccountId: otherAccId, value: opValue }
		);

		return true;
	}
	catch (err) {
		console.log(err);
	}
}

module.exports = {
	getAllTransactions, makeTransaction
}