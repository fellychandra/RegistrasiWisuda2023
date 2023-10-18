const express = require("express");
const router = express.Router();

const mahasiswaNot = require('../../controllers/mahasiswa/mahasiswaNotController');
const mahasiswaDone = require('../../controllers/mahasiswa/mahasiswaDoneController');
// const { validation } = require('./validationBarang');


router.route('/')
    .get(mahasiswaNot.index)

router.route('/belum')
    .get(mahasiswaNot.index)
    .post(mahasiswaNot.store)
    .put(mahasiswaNot.update)
    .patch(mahasiswaNot.updateData)
    .delete(mahasiswaNot.deleteData)

router.route('/belum/:id')
    .get(mahasiswaNot.findOne)

router.route('/sudah')
    .get(mahasiswaDone.index)
    .put(mahasiswaDone.update)
router.route('/sudah')
    .get(mahasiswaDone.index)
    .put(mahasiswaDone.update)

router.route('/pdf')
    .get(mahasiswaNot.pdf)

module.exports = router;