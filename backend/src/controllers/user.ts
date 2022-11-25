import UserInterface from '../interfaces/user';
const UserService = require('../services/user');


const create = async (req: Request, res: any, next: any) => {
	const { username, password } = req.body as UserInterface;
	try {
		const verify = await UserService.create(username, password, req.body);
		if (verify['id'] != undefined) return res.status(201).send({ status: "201" });
		if (verify.includes('já existe')) { res.status(500).send('"username já cadastrado!"') }
	} catch (err) {
		return res.status(500).send(err);
	}
}

const login = async (req: Request, res: any, next: any) => {
	const { username, password } = req.body as UserInterface;
	try {
		const result = await UserService.login(username, password, req.body);

		if (result['id'] != undefined) return res.status(200).send(result);
		if (result.includes('username')) { res.status(404).send('"Usuário não cadastrado! Crie sua conta para acessar"') }
		if (result.includes('Senha')) { res.status(403).send('"Senha Incorreta!"') }
	} catch (err) {
		next(err);
	}
}

const tokenVerify =
	async (req: any, res: any, next: any): Promise<Response | void> => {

		const { authorization: token } = req.headers;

		if (!token) return res.status(404).json('Token is not valid!');
		try {
			const loggedUser = await UserService.tokenVerify(token);
			return res.status(200).json(loggedUser);
		} catch (error) {
			next(error);
		}
	}

module.exports = {
	create, login, tokenVerify
}
