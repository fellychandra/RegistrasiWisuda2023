var express = require('express');
var router = express.Router();

const loginController = require('../../controllers/LoginController.js')

router.route("/")
    .get(loginController.index)
    .post(loginController.login);

router.route("/daftar")
    .get(loginController.register)
    .post(loginController.daftar);

router.route("/login")
    .get(loginController.index)
    .post(loginController.login);

router.route("/logout")
    .get(loginController.logout)

module.exports = router;
