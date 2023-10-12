const express = require("express");
const router = express.Router();

const upload = require('../../middleware/fileUpload');

const importMhs = require('../../controllers/import/importMhs');
const importOrtu = require('../../controllers/import/importOrtu');


// ==================


// ==================

router.route('/')
    .get(importMhs.index)

router.route('/mahasiswa')
    .get(importMhs.importMhs)
    .post(upload.single('xlsx'), importMhs.index)

router.route('/orangtua')
    .get(importOrtu.importOrtu)
    .post(upload.single('xlsx'), importOrtu.index)
    

module.exports = router;