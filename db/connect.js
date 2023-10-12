const mongoose = require('mongoose');

const connectDB = (url) => {
    return mongoose.connect(url)
}
module.exports = connectDB;


// const mongoose = require('mongoose');
// require('dotenv').config();

// const connectDB = async (url) => {

//     try {
//         await mongoose.connect(url, {
//          useNewUrlParser: true,
//          useUnifiedTopology: true,
// });
//         console.log('Connected to MongoDB');
//     } catch (error) {
//         console.error('Koneksi ke MongoDB gagal', error);
//     }
// };

// module.exports = connectDB;