const orangtuaModel = require('../../models/orangtua');

const index = async (req, res) => {
    url = req.originalUrl.toString()
    try {
        if (req.xhr) {
            const { draw, order, start, length, search, filterNama, filterNim, filterJurusan } = req.query;

            let pushWhere = [];
            if (search && search.value !== "") {
                const regexSearch = new RegExp(search.value, "i");
                pushWhere = [
                    {
                        name: regexSearch,
                    },
                    {
                        nim: regexSearch,
                    },
                    {
                        jurusan: regexSearch,
                    },
                    {
                        noKursi: regexSearch
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

            // result
            let result = await orangtuaModel.aggregate([
                {
                    $match: {
                        ...whereQuery,
                    },
                },
                { $skip: parseInt(start) },
                { $limit: parseInt(length) },
                { $sort: { [sortColumn]: sortDir } },
            ]);

            // count all data
            let countDocuments = await orangtuaModel.aggregate([
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

                let button = `
                    <div class="dropdown">
                        <button type="button"
                            class="btn btn-sm btn-primary p-1 px-3 dropdown-toggle"
                            data-bs-toggle="dropdown">
                            Pilih Aksi
                        </button>
                        <div class="dropdown-menu">
                            <a  href="penjualan/formEdit/${v._id}" class="dropdown-item"><i
                                    class="fa fa-pencil pe-2"></i>Edit</a>
                            
                            <button class="btn-delete dropdown-item" data-id="${v._id}" data-transaksiref="${v.transaksiRef}">
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
                });
                number++;
            });

            output.data = pushResult;


            return res.status(200).json(output);
        }

        res.render("orangtua/sudah/index", {
            title: "Sudah Regis",
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
        const orangtua = await orangtuaModel.updateOne(
            { _id: id },
            {
                isRegis: false,
                clientId: req.session.clientId,
            }
        );
        res.status(200).json({
            status: 200,
            message: "Berhasil Membatalkan Registasi Orangtua",
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