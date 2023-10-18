const mahasiswaModel = require('../../models/mahasiswa');
const prodiModel = require('../../models/prodi')

const index = async (req, res) => {
    url = req.originalUrl.toString()
    try {
        if (req.xhr) {
            const { draw, order, start, length, search, filterNama, filterNim, filterProdi } = req.query;

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
                        prodi: regexSearch,
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
                isRegis: true
            };


            if (filterNama) {
                whereQuery.name = { $regex: new RegExp(filterNama, "i") };
            }

            if (filterNim) {
                whereQuery.nim = { $regex: new RegExp(filterNim, "i") };
            }

            if (filterProdi) {
                whereQuery.prodi = { $regex: new RegExp(filterProdi, "i") };
            }

            if (pushWhere.length > 0) {
                whereQuery.$or = pushWhere;
            }

            // order column
            let orderColumn = ["", "nim", "name", "jurusan", "prodi", "noIjazah", "noKursi", "isRegis"];
            let indexColumn = parseInt(order[0].column);
            let dir = order[0].dir;
            let sortDir = dir === "asc" ? 1 : -1;
            let sortColumn = orderColumn[indexColumn];

            if (sortColumn === "noKursi") {
                sortColumn = "noKursi"; // Jangan gunakan sortColumn
            }

            // result
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
                        isRegis: true
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
                let isMhsRegis = `<button class="btn btn-success mx-1 btn-isRegis" type="button" data-bs-toggle="modal" data-id="${v._id}" data-bs-target="#isRegisConfirm">
                <i class="fa fa-check"></i></button>`;

                let status = `
                <div class="d-grid justify-content-start ">
                    <span class="badge ${v.isRegis ? 'bg-success' : 'bg-danger'} m-1">Sudah Registrasi</span>
                </div>
                `;

                pushResult.push({
                    no: number,
                    nim: v.nim,
                    name: v.name,
                    jurusan: v.jurusan,
                    prodi: v.prodi,
                    noIjazah: v.noIjazah,
                    noKursi: v.noKursi,
                    isRegis: status,
                    Regis: isMhsRegis.trim(),
                });
                number++;
            });

            output.data = pushResult;


            return res.status(200).json(output);
        }
        const prodiList = await prodiModel.find();
        res.render("mahasiswa/sudah/index", {
            title: "Sudah Regis",
            prodis: prodiList,
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

const update = async (req, res) => {
    const { id } = req.body;

    try {
        const Mahasiswa = await mahasiswaModel.updateOne(
            { _id: id },
            {
                isRegis: false,
                clientId: req.session.clientId,
            }
        );
        res.status(200).json({
            status: 200,
            message: "Berhasil Membatalkan Registasi Mahasiswa",
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Terjadi kesalahan data",
        });
    }
}


module.exports = {
    index,
    update,

};