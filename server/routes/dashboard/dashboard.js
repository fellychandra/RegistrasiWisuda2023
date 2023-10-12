var express = require('express');
var router = express.Router();

const orangtuaModel = require('../../models/orangtua');
const mahasiswaModel = require('../../models/mahasiswa');

router.get('/', async function (req, res) {
  url = req.originalUrl
  try {

    let countDocumentsMhsNot = await mahasiswaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: false
        },
      },
    ]);

    let countDocumentsMhsDone = await mahasiswaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: true
        },
      },
    ]);

    
    let countDocumentsOrtuNot = await orangtuaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: false
        },
      },
    ]);

    let countDocumentsOrtuDone = await orangtuaModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isRegis: true
        },
      },
    ]);

    res.render('dashboard/index', {
      mhsNot: countDocumentsMhsNot.length,
      mhsDone: countDocumentsMhsDone.length,
      ortuNot: countDocumentsOrtuNot.length,
      ortuDone: countDocumentsOrtuDone.length,
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
