const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
        cb(null, './public/mhs/');

    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const modifiedName = file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop();
        req.modifiedFileName = modifiedName;
        cb(null, modifiedName)
    }
})
const fileFilter = (req, file, cb) => {
    if (file) {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // Mime type untuk XLSX
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    } else {
        // Handle case when no file is uploaded
        cb(null, true); // Set to true if the file is optional
    }
}

let upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter
});

module.exports = upload

