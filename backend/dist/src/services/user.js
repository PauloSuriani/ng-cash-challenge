"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const bcrypt = __importStar(require("bcryptjs"));
const validationError_1 = __importDefault(require("./validationError"));
const JWT = __importStar(require("jsonwebtoken"));
const fs_1 = require("fs");
const UserModel = require('../database/models/user.model');
const AccountModel = require('../database/models/account.model');
const create = (name, password, body) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        username: joi_1.default.string().required().min(3).message('"username" deve possuir ao menos 3 caracteres!'),
        password: joi_1.default.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[0-9]).{8,}$')).message('"senha" deve ter ao menos 8 caracteres, 1 número e 1 letra maiúscula!'),
    });
    yield schema.validateAsync(body);
    const userSearch = yield UserModel.findOne({ where: { username: name } }, { raw: true });
    if (userSearch) {
        return ('"username" já existe');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    password = hash;
    try {
        const { dataValues: dv } = yield AccountModel.create({ balance: 100.00 });
        const { id: accountId } = dv;
        const { dataValues } = yield UserModel.create({ username: name, password, accountId }, { raw: true });
        return dataValues;
    }
    catch (err) {
        console.log(err);
    }
});
const login = (name, password, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSearch = yield UserModel.findOne({ where: { username: name } }, { raw: true });
        if (!userSearch) {
            return ('"username" inválido');
        }
        if (!bcrypt.compareSync(password, userSearch.password)) {
            return ('Senha incorreta!');
        }
        const jwtSecret = (0, fs_1.readFileSync)('jwt.evaluation.key', 'utf8');
        const token = JWT.sign({ username: name }, jwtSecret, {
            expiresIn: '24h',
            algorithm: 'HS256',
        });
        const { dataValues } = userSearch;
        let loggedUser = Object.assign(Object.assign({}, dataValues), { token, status: 200 });
        return loggedUser;
    }
    catch (err) {
        console.log(err);
    }
});
const tokenVerify = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const jwtSecret = (0, fs_1.readFileSync)('jwt.evaluation.key', 'utf8');
    const { username } = JWT.verify(token, jwtSecret);
    const result = yield UserModel.findOne({ where: { username } }, { raw: true });
    const { dataValues } = result;
    if (!result) {
        throw new validationError_1.default('Token Inválido!');
    }
    const resultAcc = yield AccountModel.findOne({ where: { id: dataValues.id } }, { raw: true });
    const { dataValues: dv } = resultAcc;
    return {
        id: dataValues.id,
        username: dataValues.username,
        balance: dv.balance,
        accountId: dv.id,
        status: 200,
    };
});
module.exports = {
    create, login, tokenVerify
};
