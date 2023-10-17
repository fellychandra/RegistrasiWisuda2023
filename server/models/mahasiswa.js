const mongoose = require('mongoose');

const MahasiswaSchema = new mongoose.Schema(
    {
        nim: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
        },
        nik: {
            type: String,
        },
        noIjazah: {
            type: String,
            unique: true,
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

module.exports = mongoose.model("Mahasiswa", MahasiswaSchema);
