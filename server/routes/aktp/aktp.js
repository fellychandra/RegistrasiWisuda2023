const express = require("express");
const router = express.Router();

const mahasiswaNotAktp = require('../../controllers/aktp/mahasiswa/mahasiswaNotController');
const mahasiswaDoneAktp = require('../../controllers/aktp/mahasiswa/mahasiswaDoneController');
// const { validation } = require('./validationBarang');


router.route('/')
    .get(mahasiswaNotAktp.index)

router.route('/mahasiswa')
    .get(mahasiswaNotAktp.index)
//     .post(mahasiswaNotAktp.store)
//     .put(mahasiswaNotAktp.update)
//     .patch(mahasiswaNotAktp.updateData)
//     .delete(mahasiswaNotAktp.deleteData)

router.route('/mahasiswa/belum')
    .get(mahasiswaNotAktp.index)
    .post(mahasiswaNotAktp.store)
    .put(mahasiswaNotAktp.update)
    .patch(mahasiswaNotAktp.updateData)
    .delete(mahasiswaNotAktp.deleteData)

router.route('/belum/:id')
    .get(mahasiswaNotAktp.findOne)

router.route('/sudah')
    .get(mahasiswaDoneAktp.index)

router.route('/sudah')
    .get(mahasiswaDoneAktp.index)
    .put(mahasiswaDoneAktp.update)
    
router.route('/pdf')
    .get(mahasiswaNotAktp.pdf)

module.exports = router;