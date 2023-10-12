const jwt = require("jsonwebtoken");
require("dotenv").config();


const webProtect = async (req, res, next) => {
    const { token, name, _id, role } = req.session;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log(decoded);
            res.locals = { name, jabatan: role };
            next();
        } catch (error) {
            console.log("get error midleware", error.message);
            res.clearCookie('huhu');
            delete req.session.token;
            delete req.session.name;
            delete req.session._id;
            req.flash("error", "Authorization akses kehalaman Login");
            res.redirect("/login");
        }
    }

    if (!token) {
        req.flash("error", "Silahkan login terlebih dahulu");
        res.redirect("/");
    }

};

const isLogin = async (req, res, next) => {
    const { token, name, _id } = req.session;
    if (token) {
        req.is_login = true;
    }
    next();
};

module.exports = {
    webProtect,
    isLogin,
};

