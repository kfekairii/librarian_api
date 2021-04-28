const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please add a title"],
      trim: true,
      unique: true,
      maxlength: [150, "Title can not be more than 150 characters"],
    },
    subTitle: {
      type: String,
      required: [true, "please add a Subtitle"],
      trim: true,
      maxlength: [450, "Title can not be more than 450 characters"],
    },
    slug: String,
    Authors: [
      {
        type: String,
        required: true,
        trim: true,
        maxlength: [250, "Author can not be more than 250 characters"],
      },
    ],
    description: String,
    publisher: String,
    publishDate: { type: Date },
    ISNB: String,
    pageCount: Number,
    categories: [
      {
        type: String,
      },
    ],
    averageRating: Number,
    ratingsCount: Number,
    language: String,
    imageLinks: [
      {
        type: String,
        default: "no-photo.jpg",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);
