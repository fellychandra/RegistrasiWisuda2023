const xlsx = require('xlsx');
const orangtuaModel = require('../../models/orangtua');

const index = async (req, res) => {
    url = req.originalUrl.toString()
    try {
        const workbook = xlsx.readFile(`./public/mhs/${req.modifiedFileName}`)
        const sheetName = workbook.SheetNames[0]; // Mengambil nama sheet pertama
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        data.forEach(async (item) => {
            const orangtua = new orangtuaModel({ nim: item.NIM, name: item.Nama_Mahasiswa, prodi: item.Program_Studi, noKursi: item.No_Kursi }); // Pastikan model Anda cocok
            try {
                await orangtua.save();
                console.log(`Data orangtua ${orangtua.name} berhasil disimpan.`);
            } catch (error) {
                console.error(`Gagal menyimpan data orangtua: ${error.message}`);
            }
        });

        res.redirect("/orangtua/belum");
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Terjadi kesalahan data",
            result: error.message,
        });
    }
};

const importOrtu = async (req, res) => {
    url = req.originalUrl.toString()
    try {
        res.render("import/orangtua", {
            title: "Import Data orang tua",
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
    importOrtu,
};
