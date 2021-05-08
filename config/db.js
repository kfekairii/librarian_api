const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  const conn = await mongoose.connect(
    "mongodb+srv://librarian_db:441257sS@@cluster0.xi52l.mongodb.net/librarian_db?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  );
  console.log(`MonogoDB connected: ${conn.connection.host}`.black.bgYellow);
};

module.exports = connectDB;
