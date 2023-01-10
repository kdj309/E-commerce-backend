const mongoose = require('mongoose');
//?importing mongoose library which is used to ease the databse related work by providing built in methods such as schema and connect
require('dotenv').config()
//?configuring the env file to use private or sensitive variable from env file using process.env.<variablename>
const mongoUri = process.env.MONGOURI;
//?unique string of the localhost mongodb databse
exports.dbconnect = () => {
    mongoose.connect(mongoUri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
        .then(() => {
            console.log("db connected");
        })
        .catch(() => {
            console.log("error occured");
        })
}
//?function to connect to mongodb database which accepts uri and callback function