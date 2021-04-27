const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  const conn = await mongoose.connect("mongodb://127.0.0.1:27017/sblib_db", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(`MonogoDB connected: ${conn.connection.host}`.black.bgYellow);
};

module.exports = connectDB;
