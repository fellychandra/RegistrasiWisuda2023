const mongoose = require('mongoose');

const OrangtuaSchema = new mongoose.Schema(
    {
        // nim: {
        //     type: String,
        //     unique: true,
        // },
        name: {
            type: String,
        },
        nik: {
            type: String,
        },
        noIjazah: {
            type: String,
        },
        prodi: {
            type: String,
        },
        jurusan: {
            type: String,
        },
        ipk: {
            type: String,
        },
        noKursi: {
            type: String,
        },
        isRegis: {
            type: Boolean,
            default: false,
        },
        deletedAt: String,
        deletedBy: String,
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // added createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model("Orangtua", OrangtuaSchema);
