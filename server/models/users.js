const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide name'],
            minlength: 3,
            maxlength: 20,
            trim: true,
        },
        username: {
            type: String,
            required: [true, 'Tolong masukkan username'],
            unique: true,
        },
        email: {
            type: String,
        },
        role: {
            type: String,
        },
        password: {
            type: String,
            required: [true, 'Please provide password'],
            minlength: 6,
            select: false,
        },
        isActive: {
            type: Boolean,
            default: true,
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

UserSchema.pre('save', async function () {
    console.log(this.modifiedPaths());
    console.log(this.modifiedPaths('name'));

    // if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model("User", UserSchema);
