const mongoose = require('mongoose');

const ProdiSchema = new mongoose.Schema(
    {
        
        prodi: {
            type: String,
        },
    },
    {
        timestamps: true, // added createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model("Prodi", ProdiSchema);
