var express = require('express');
var router = express.Router();

const orangtuaModel = require('../../models/orangtua');
const mahasiswaModel = require('../../models/mahasiswa');

router.get('/', async function (req, res) {
  url = req.originalUrl
  try {

    let countDocumentsMhs = await mahasiswaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: false,
        },
      },
    ]);

    let countDocumentsMhsJti = await mahasiswaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: false,
          jurusan: "JTI"
        },
      },
    ]);
    let countDocumentsMhsJtin = await mahasiswaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: false,
          jurusan: "JTIN"
        },
      },
    ]);

    let countDocumentsMhsAktp = await mahasiswaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: false,
          jurusan: "AKTP"
        },
      },
    ]);
    let countDocumentsMhsDone = await mahasiswaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: true,
        },
      },
    ]);

    let countDocumentsMhsJtiDone = await mahasiswaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: true,
          jurusan: "JTI"
        },
      },
    ]);
    let countDocumentsMhsJtinDone = await mahasiswaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: true,
          jurusan: "JTIN"
        },
      },
    ]);

    let countDocumentsMhsAktpDone = await mahasiswaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: true,
          jurusan: "AKTP"
        },
      },
    ]);

    //orangtua
    let countOrtuDone = await orangtuaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: false,
        },
      },
    ]);
    let countOrtuNot = await orangtuaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: false,
        },
      },
    ]);


    res.render('dashboard/index', {
      mhsAll: countDocumentsMhs.length,
      mhsJti: countDocumentsMhsJti.length,
      mhsJtin: countDocumentsMhsJtin.length,
      mhsAktp: countDocumentsMhsAktp.length,
      mhsAllDone: countDocumentsMhsDone.length,
      mhsJtiDone: countDocumentsMhsJtiDone.length,
      mhsJtinDone: countDocumentsMhsJtinDone.length,
      mhsAktpDone: countDocumentsMhsAktpDone.length, 
      ortuAllDone: countOrtuDone.length,
      ortuAllNot: countOrtuNot.length,
      title: "Halaman Registrasi",
      currentUrl: url,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: "Terjadi kesalahan data",
      result: error.message,
    });
  }
});




module.exports = router;
