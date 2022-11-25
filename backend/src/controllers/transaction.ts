import AccountInterface from '../interfaces/account';
import UserInterface from '../interfaces/user';
import TransactionInterface from '../interfaces/transaction';
const TransactionService = require('../services/transaction');


const getAllTransactions = async (req: Request, res: any, next: any) => {
  const { accountId } = req.body as AccountInterface;
  console.log('acc id: ', accountId);
  try {
    if (accountId) {
      const result = await TransactionService.getAllTransactions(accountId);
      res.status(200).send(result);
    }
  } catch (err) {
    next(err);
  }
}

const makeTransaction = async (req: Request, res: any, next: any) => {
  const { accountId: originAccId } = req.body as AccountInterface;
  const { username: otherUserName } = req.body as UserInterface;
  const { value: opValue } = req.body as TransactionInterface;
  try {
    const result = await TransactionService.makeTransaction(originAccId, otherUserName, opValue);
    if (result === true) {
      res.status(201).send({ "status": "201" })
    }
    if (result.includes('não realizada')) {
      res.status(403).send('"Operação não realizada, usuário de destino não encontrado!"');
    }
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = {
  getAllTransactions, makeTransaction
}
