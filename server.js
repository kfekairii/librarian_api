const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Load Routes
const bookRoutes = require("./routes/books");

// Load env file
dotenv.config({ path: "./config/config.env" });

const app = express();

// HTTP request Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Mount router
app.use("/api/v1/books", bookRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server isrunning in ${process.env.NODE_ENV} mode on PORT ${PORT}`
  )
);
