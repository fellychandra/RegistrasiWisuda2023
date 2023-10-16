const express = require("express");
const router = express.Router();

const mahasiswaNotJtin = require('../../controllers/jtin/mahasiswa/mahasiswaNotController');
const mahasiswaDoneJtin = require('../../controllers/jtin/mahasiswa/mahasiswaDoneController');
// const { validation } = require('./validationBarang');


router.route('/')
    .get(mahasiswaNotJtin.index)

router.route('/mahasiswa')
    .get(mahasiswaNotJtin.index)
    .post(mahasiswaNotJtin.store)
    .put(mahasiswaNotJtin.update)
    .patch(mahasiswaNotJtin.updateData)
    .delete(mahasiswaNotJtin.deleteData)

router.route('/mahasiswa/belum')
    .get(mahasiswaNotJtin.index)
    .post(mahasiswaNotJtin.store)
    .put(mahasiswaNotJtin.update)
    .patch(mahasiswaNotJtin.updateData)
    .delete(mahasiswaNotJtin.deleteData)

router.route('/belum/:id')
    .get(mahasiswaNotJtin.findOne)

router.route('/mahasiswa/sudah')
    .get(mahasiswaDoneJtin.index)

router.route('/sudah')
    .get(mahasiswaDoneJtin.index)
    .put(mahasiswaDoneJtin.update)
router.route('/sudah')
    .get(mahasiswaDoneJtin.index)
    .put(mahasiswaDoneJtin.update)

module.exports = router;