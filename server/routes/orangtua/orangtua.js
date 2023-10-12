const express = require("express");
const router = express.Router();

const orangtuaNot = require('../../controllers/orangtua/orangtuaNotController');
const orangtuaDone = require('../../controllers/orangtua/orangtuaDoneController');
// const { validation } = require('./validationBarang');


router.route('/')
    .get(orangtuaNot.index)

router.route('/belum')
    .get(orangtuaNot.index)
    .post(orangtuaNot.store)
    .put(orangtuaNot.update)
    .patch(orangtuaNot.updateData)
    .delete(orangtuaNot.deleteData)

router.route('/belum/:id')
    .get(orangtuaNot.findOne)

router.route('/sudah')
    .get(orangtuaDone.index)
    .put(orangtuaDone.update)



module.exports = router;