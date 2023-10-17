const express = require("express");
const router = express.Router();

const mahasiswaNotJti = require('../../controllers/jti/mahasiswa/mahasiswaNotController');
const mahasiswaDoneJti = require('../../controllers/jti/mahasiswa/mahasiswaDoneController');
// const { validation } = require('./validationBarang');


router.route('/')
    .get(mahasiswaNotJti.index)

router.route('/mahasiswa')
    .get(mahasiswaNotJti.index)
// .post(mahasiswaNotJti.store)
// .put(mahasiswaNotJti.update)
// .patch(mahasiswaNotJti.updateData)
// .delete(mahasiswaNotJti.deleteData)

router.route('/mahasiswa/belum')
    .get(mahasiswaNotJti.index)
    .post(mahasiswaNotJti.store)
    .put(mahasiswaNotJti.update)
    .patch(mahasiswaNotJti.updateData)
    .delete(mahasiswaNotJti.deleteData)

router.route('/belum/:id')
    .get(mahasiswaNotJti.findOne)

router.route('/sudah')
    .get(mahasiswaDoneJti.index)
    .put(mahasiswaDoneJti.update)

router.route('/pdf')
    .get(mahasiswaNotJti.pdf)

module.exports = router;