const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");

// Load Routes
const bookRoutes = require("./routes/books");
const authorRoutes = require("./routes/authors");
const authRoutes = require("./routes/auth");

// Load env file
dotenv.config({ path: "./config/config.env" });

const app = express();
connectDB();

/*=====================================================*/
/* Middelwarea goas here */
/*=====================================================*/

// HTTP request Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// use body parser
app.use(express.json());

// use cokkie-parse
app.use(cookieParser());

// Mount routes
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/authors", authorRoutes);
app.use("/api/v1/auth", authRoutes);
// Error Hundler
app.use(errorHandler);

/*=====================================================*/

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server isrunning in ${process.env.NODE_ENV} mode on PORT ${PORT}`.white
      .bgBlue
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close server
  server.close(() => process.exit(1));
});
