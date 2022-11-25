import Joi from 'joi';
import * as bcrypt from 'bcryptjs';
import ValidationError from './validationError';
import * as JWT from 'jsonwebtoken';
import { readFileSync } from 'fs';
const UserModel = require('../database/models/user.model');
const AccountModel = require('../database/models/account.model');

const create = async (name: string, password: string, body: any) => {
	const schema = Joi.object({
		username: Joi.string().required().min(3).message('"username" deve possuir ao menos 3 caracteres!'),
		password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[0-9]).{8,}$')).message('"senha" deve ter ao menos 8 caracteres, 1 número e 1 letra maiúscula!'),
	});
	await schema.validateAsync(body);

	const userSearch = await UserModel.findOne({ where: { username: name } }, { raw: true });
	if (userSearch) {
		return ('"username" já existe');
	}

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password as string, salt);
	password = hash;

	try {
		const { dataValues: dv } = await AccountModel.create({ balance: 100.00 });
		const { id: accountId } = dv;
		const { dataValues } = await UserModel.create({ username: name, password, accountId }, { raw: true });
		return dataValues;
	}
	catch (err) {
		console.log(err);
	}
}

const login = async (name: string, password: string, body: any) => {
	try {
		const userSearch = await UserModel.findOne({ where: { username: name } }, { raw: true });
		if (!userSearch) {
			return ('"username" inválido');
		}
		if (!bcrypt.compareSync(password, userSearch.password)) {
			return ('Senha incorreta!');
		}

		const jwtSecret = readFileSync('jwt.evaluation.key', 'utf8');
		const token = JWT.sign({ username: name }, jwtSecret, {
			expiresIn: '24h',
			algorithm: 'HS256',
		});

		const { dataValues } = userSearch;
		let loggedUser = { ...dataValues, token, status: 200 }
		return loggedUser
	}
	catch (err) {
		console.log(err);
	}
}

const tokenVerify = async (token: string): Promise<{}> => {
	const jwtSecret = readFileSync('jwt.evaluation.key', 'utf8');
	const { username } = JWT.verify(token, jwtSecret) as JWT.JwtPayload;

	const result = await UserModel.findOne({ where: { username } }, { raw: true });
	const { dataValues } = result;
	if (!result) {
		throw new ValidationError('Token Inválido!');
	}
	const resultAcc = await AccountModel.findOne({ where: { id: dataValues.id } }, { raw: true });
	const { dataValues: dv } = resultAcc;
	return {
		id: dataValues.id,
		username: dataValues.username,
		balance: dv.balance,
		accountId: dv.id,
		status: 200,
	}
}

module.exports = {
	create, login, tokenVerify
}