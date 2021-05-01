const mongoose = require("mongoose");
const slugify = require("slugify");

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
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "Author",
    },

    description: String,
    publisher: String,
    publishDate: String,
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

BookSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Book", BookSchema);
