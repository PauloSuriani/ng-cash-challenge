var { Router } = require('express');
var router = Router();

const UserController = require('../controllers/user');

router.route('/register').post(UserController.create)
router.route('/login').post(UserController.login);
router.route('/validate').get(UserController.tokenVerify);

module.exports = router;