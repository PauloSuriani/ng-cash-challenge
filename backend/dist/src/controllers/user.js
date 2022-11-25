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
const UserService = require('../services/user');
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const verify = yield UserService.create(username, password, req.body);
        if (verify['id'] != undefined)
            return res.status(201).send({ status: "201" });
        if (verify.includes('já existe')) {
            res.status(500).send('"username já cadastrado!"');
        }
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const result = yield UserService.login(username, password, req.body);
        if (result['id'] != undefined)
            return res.status(200).send(result);
        if (result.includes('username')) {
            res.status(404).send('"Usuário não cadastrado! Crie sua conta para acessar"');
        }
        if (result.includes('Senha')) {
            res.status(403).send('"Senha Incorreta!"');
        }
    }
    catch (err) {
        next(err);
    }
});
const tokenVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization: token } = req.headers;
    if (!token)
        return res.status(404).json('Token is not valid!');
    try {
        const loggedUser = yield UserService.tokenVerify(token);
        return res.status(200).json(loggedUser);
    }
    catch (error) {
        next(error);
    }
});
module.exports = {
    create, login, tokenVerify
};
