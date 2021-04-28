const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

// Load Routes
const bookRoutes = require("./routes/books");

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

// Mount router
app.use("/api/v1/books", bookRoutes);

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
