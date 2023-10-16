const mahasiswaModel = require('../../../models/mahasiswa');

const index = async (req, res) => {
    url = req.originalUrl.toString()
    try {
        if (req.xhr) {
            const { draw, order, start, length, search, filterNama, filterNim, filterJurusan } = req.query;

            console.log(req.query);

            let pushWhere = [];
            if (search && search.value !== "") {
                const regexSearch = new RegExp(search.value, "i");

                pushWhere = [
                    {
                        nim: regexSearch,
                    },
                    {
                        name: regexSearch,
                    },
                    {
                        jurusan: regexSearch,
                    },
                    {
                        noKursi: regexSearch
                    },
                    {
                        noIjazah: regexSearch,
                    },
                ];
            }


            // jika ada pencarian data
            let whereQuery = {
                isDeleted: false,
                isRegis: false,
                prodi: "JTI"
            };

            if (filterNama) {
                whereQuery.name = { $regex: new RegExp(filterNama, "i") };
            }

            if (filterNim) {
                whereQuery.nim = { $regex: new RegExp(filterNim, "i") };
            }

            if (filterJurusan) {
                whereQuery.jurusan = { $regex: new RegExp(filterJurusan, "i") };
            }

            if (pushWhere.length > 0) {
                whereQuery.$or = pushWhere;
            }

            // order column
            let orderColumn = ["", "nim", "name", "jurusan", "noIjazah", "noKursi", "isRegis"];
            let indexColumn = parseInt(order[0].column);
            let dir = order[0].dir;
            let sortDir = dir === "asc" ? 1 : -1;
            let sortColumn = orderColumn[indexColumn];


            if (sortColumn === "noKursi") {
                sortColumn = "noKursi"; // Jangan gunakan sortColumn
            }

            let result = await mahasiswaModel.aggregate([
                {
                    $match: {
                        ...whereQuery,
                    },
                },
                {
                    $addFields: {
                        angkaPart: {
                            $toInt: {
                                $arrayElemAt: [{ $split: ["$noKursi", "."] }, 1],
                            },
                        },
                    },
                },
                { $sort: { noKursi: sortDir, angkaPart: sortDir } }, // Lakukan pengurutan
                { $skip: parseInt(start) },
                { $limit: parseInt(length) },
            ]);

            // count all data
            let countDocuments = await mahasiswaModel.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        isRegis: false
                    },
                },
            ]);

            let countAllData = countDocuments.length;
            if (pushWhere.length > 0) {
                countAllData = result.length;
            }

            let output = {};
            output.draw = parseInt(draw);
            output.recordsTotal = countAllData;
            output.recordsFiltered = countAllData;
            let pushResult = [];
            let number = parseInt(start) + 1;
            result.forEach((v, i) => {
                let isMhsRegis = `<button class="btn btn-outline-success mx-1 btn-isRegis" type="button" data-bs-toggle="modal" data-id="${v._id}" data-bs-target="#isRegisConfirm">
                <i class="fa fa-check"></i></button>`;

                let status = `
                <div class="d-grid justify-content-start ">
                    <span class="badge ${v.isRegis ? 'bg-success' : 'bg-danger'} m-1">Belum Registrasi</span>
                </div>
                `;

                let button = `
                    <div class="dropdown">
                        <button type="button"
                            class="btn btn-sm btn-outline-primary p-1 px-3 dropdown-toggle"
                            data-bs-toggle="dropdown">
                            Pilih Aksi
                        </button>
                        <div class="dropdown-menu">
                            <button data-bs-toggle="modal"
                            data-bs-target="#modalMhsTambah" class="dropdown-item btn-edit" data-id="${v._id}"><i
                                    class="fa fa-pencil pe-2"></i>Edit</button>
                            
                            <button class="btn-delete dropdown-item" data-id="${v._id}">
                                <i class="fa fa-trash pe-2"></i>Hapus</button>
                        </div>
                    </div>
                `;
                pushResult.push({
                    no: number,
                    nim: v.nim,
                    name: v.name,
                    jurusan: v.jurusan,
                    noIjazah: v.noIjazah,
                    noKursi: v.noKursi,
                    isRegis: status,
                    Regis: isMhsRegis.trim(),
                    action: button.trim(),
                });
                number++;
            });

            output.data = pushResult;


            return res.status(200).json(output);
        }

        res.render("jti/mahasiswa/belum/index", {
            title: "Belum Regis",
            currentUrl: url,
        });
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Terjadi kesalahan data",
            result: error.message,
        });
    }
};

const store = async (req, res) => {
    const { nama, nim, jurusan, noIjazah, noKursi } = req.body;

    try {
        const Mahasiswa = await mahasiswaModel.create({ name: nama, nim: nim, jurusan: jurusan, noIjazah: noIjazah, noKursi: noKursi, clientId: req.session._id })
        res.status(201).json({
            status: 200,
            message: "Berhasil Menambahkan Mahasiswa",
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: "Terjadi kesalahan data",
        });
    }
}

const update = async (req, res) => {
    const { id } = req.body;

    try {
        const Mahasiswa = await mahasiswaModel.updateOne(
            { _id: id },
            {
                isRegis: true,
                clientId: req.session.clientId,
            }
        );
        res.status(200).json({
            status: 200,
            message: "Berhasil Meregistrasi Mahasiswa",
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Terjadi kesalahan data",
        });
    }
}

const findOne = async (req, res) => {
    const { id } = req.params
    try {
        let mahasiswa = await mahasiswaModel.findOne({ _id: id })
        return res.status(200).json({
            status: 200,
            message: "Berhasil Mendapatkan barang",
            result: mahasiswa
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: "Terjadi kesalahan data",
        });
    }
}

const updateData = async (req, res) => {
    const { id, nim, nama, jurusan, noIjazah, noKursi } = req.body
    try {
        const Mahasiswa = await mahasiswaModel.updateOne(
            { _id: id },
            {
                nim: nim,
                name: nama,
                jurusan: jurusan,
                noIjazah: noIjazah,
                noKursi: noKursi,
                clientId: req.session.clientId,
            }
        );
        res.status(200).json({
            status: 200,
            message: "Berhasil Mengedit Data Mahasiswa",
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Terjadi kesalahan data",
        });
    }
}

const deleteData = async (req, res) => {
    try {
        const { id } = req.body;
        let getData = await mahasiswaModel.findByIdAndDelete({
            _id: id,
        });

        if (getData) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil hapus data",
            });
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal hapus data",
            });
        }
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
    store,
    update,
    findOne,
    updateData,
    deleteData,

};