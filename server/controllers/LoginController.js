const User = require('../models/users');
const { validationResult } = require("express-validator");
const { StatusCodes } = require('http-status-codes');

const isLogin = (req, res) => {
    if (req.is_login) {
        res.redirect("/dashboard")
    }
}

const index = async (req, res) => {
    isLogin(req, res)
    console.log(req.session);
    try {
        // alert session
        const alert = {};
        alert.status = null;
        alert.message = null;

        let message = req.flash("error")[0];
        if (message != null) {
            alert.status = "error";
            alert.message = message;
        }

        message = req.flash("success")[0];
        if (message != null) {
            alert.status = "success";
            alert.message = message;
        }

        res.render("login/register", {
            layout: "login/register",
            title: "Login page",
            alert: alert,
        });
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Terjadi kesalahan data",
            result: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password, remember } = req.body
        if (!username || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 400,
                message: "Form harus diisi semua"
            });
        }

        const user = await User.findOne({ $or: [{ username: username }, { email: username }] }).select('+password')
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 400,
                message: "User tidak ditemukan"
            });
        }

        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 400,
                message: "Password salah"
            });
        }

        const token = user.createJWT()
        user.password = undefined
        //console.log(user.password);

        req.session = {
            token,
            name: user.name,
            _id: user._id,
        };

        res.status(200).json({
            user,
            token,
            status: 200,
            message: "Berhasil Login",
        })
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: 400,
            message: error.message,
        });
    }
}


const register = async (req, res) => {
    //isLogin(req, res)
    try {

        // alert session
        const alert = {};
        alert.status = null;
        alert.message = null;

        let message = req.flash("error")[0];
        if (message != null) {
            alert.status = "error";
            alert.message = message;
        }

        message = req.flash("success")[0];
        if (message != null) {
            alert.status = "success";
            alert.message = message;
        }

        res.render("login/index", {
            layout: "login/index",
            title: "Login page",
            alert: alert,
        });
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Terjadi kesalahan data",
            result: error.message,
        });
    }
};

const daftar = async (req, res) => {
    try {
        console.log(req.body);
        const { name, username, email, password } = req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: "Invalid form validation",
                result: errors.array(),
            });
        }

        if (!name || !email || !username || !password) {
            console.log('Silakan isi semua form')
        }

        // const userAlreadyExists = await User.findOne({ username });
        // if (userAlreadyExists) {

        // }

        const user = await User.create({ name, username, email, password })
        const token = user.createJWT()
        res.status(201).json({
            user: {
                email: user.email,
                lastName: user.lastName,
                location: user.location,
                name: user.name
            }, token,
            location: user.location,
            status: 200,
            message: "Berhasil Register",
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
}

const logout = async (req, res) => {
    try {
        req.flash("success", "Berhasil logout");

        delete req.session.token;
        delete req.session.name;
        delete req.session._id;
        res.clearCookie('session');
        console.log(req.session);
        res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: "Terjadi kesalahan data",
        });
    }
};


module.exports = {
    index,
    login,
    register,
    daftar,
    logout,
};