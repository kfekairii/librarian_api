const mongoose = require("mongoose");
const slugify = require("slugify");

const BookSchema = new mongoose.Schema(
  {
    user: {
      // The user who add this book
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
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
    image_url: {
      type: String,
      default: "no-photo.jpg",
    },
  },
  { timestamps: true }
);

// Static function to get the total books added by a user
BookSchema.statics.getTotalAddedBooks = async function (userID) {
  const obj = await this.aggregate([
    {
      $match: {
        user: userID,
      },
    },
  ]);

  try {
    await this.model("User").findByIdAndUpdate(userID, {
      totalAddedBooks: obj.length,
    });
  } catch (err) {
    console.log(err);
  }
};

// add slug field
BookSchema.pre("save", function () {
  this.slug = slugify(this.title, { lower: true });
});

// get Total Added Books by current user after saving the book
BookSchema.post("save", function () {
  this.constructor.getTotalAddedBooks(this.user);
});

// get Total Added Books by current user after deleting the book
BookSchema.post("remove", function () {
  this.constructor.getTotalAddedBooks(this.user);
});

module.exports = mongoose.model("Book", BookSchema);
