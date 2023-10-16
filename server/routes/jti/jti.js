const express = require("express");
const router = express.Router();

const mahasiswaNotJti = require('../../controllers/jti/mahasiswa/mahasiswaNotController');
const mahasiswaDoneJtin = require('../../controllers/jti/mahasiswa/mahasiswaDoneController');
// const { validation } = require('./validationBarang');


router.route('/')
    .get(mahasiswaNotJti.index)

router.route('/mahasiswa')
    .get(mahasiswaNotJti.index)
    .post(mahasiswaNotJti.store)
    .put(mahasiswaNotJti.update)
    .patch(mahasiswaNotJti.updateData)
    .delete(mahasiswaNotJti.deleteData)

router.route('/mahasiswa/belum')
    .get(mahasiswaNotJti.index)
    .post(mahasiswaNotJti.store)
    .put(mahasiswaNotJti.update)
    .patch(mahasiswaNotJti.updateData)
    .delete(mahasiswaNotJti.deleteData)

router.route('/belum/:id')
    .get(mahasiswaNotJti.findOne)

router.route('/mahasiswa/sudah')
    .get(mahasiswaDoneJtin.index)
    
router.route('/sudah')
    .get(mahasiswaDoneJtin.index)
    .put(mahasiswaDoneJtin.update)
router.route('/sudah')
    .get(mahasiswaDoneJtin.index)
    .put(mahasiswaDoneJtin.update)

module.exports = router;