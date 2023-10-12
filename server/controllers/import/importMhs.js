const xlsx = require('xlsx');
const mahasiswaModel = require('../../models/mahasiswa');


const index = async (req, res) => {
    url = req.originalUrl.toString()
    try {
        const workbook = xlsx.readFile(`./public/mhs/${req.modifiedFileName}`)
        const sheetName = workbook.SheetNames[0]; // Mengambil nama sheet pertama
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        data.forEach(async (item) => {
            const mahasiswa = new mahasiswaModel({ nim: item.NIM, name: item.Nama, nik: item.NIK, noIjazah: item.Nomor_Ijazah, jurusan: item.Program_Studi, ipk: item.IPK, noKursi:item.No_kursi }); // Pastikan model Anda cocok
            try {
                await mahasiswa.save();
                console.log(`Data mahasiswa ${mahasiswa.name} berhasil disimpan.`);
            } catch (error) {
                console.error(`Gagal menyimpan data mahasiswa: ${error.message}`);
            }
        });

        res.redirect("/mahasiswa/belum");
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Terjadi kesalahan data",
            result: error.message,
        });
    }
};

const importMhs = async (req, res) => {
    url = req.originalUrl.toString()
    try {
        res.render("import/mahasiswa", {
            title: "Import Data Mahasiswa",
            currentUrl: url,
        });
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Terjadi kesalahan data",
            result: error.message,
        });
    }
}



module.exports = {
    index,
    importMhs,
};
