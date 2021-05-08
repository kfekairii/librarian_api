const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema(
  {
    user: {
      // The user who add this author
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    fullName: {
      type: String,
      required: [true, "please add the author full name"],
    },
    birthDay: String,
    deathday: String,
    bio: {
      type: String,
      maxlength: [1000, "Bio can not be more than 1000 characters"],
    },
    image_url: String,
    cloudinary_id: String,
  },
  {
    // To Create a virtual fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

/*  
Reverse Populate with virtuals

The localField and foreignField options.
Mongoose will populate documents from the model in @ref
whose @foreignField matches this document's @localField.
*/
AuthorSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "author",
  justOne: false,
});

// Static function to get the total books added by a user
AuthorSchema.statics.getTotalAddedAuthors = async function (userID) {
  const obj = await this.aggregate([
    {
      $match: {
        user: userID,
      },
    },
  ]);

  try {
    await this.model("User").findByIdAndUpdate(userID, {
      totalAddedAuthors: obj.length,
    });
  } catch (err) {
    console.log(err);
  }
};

// get Total Added Books by current user after saving the book
AuthorSchema.post("save", function () {
  this.constructor.getTotalAddedAuthors(this.user);
});

// get Total Added Books by current user after deleting the book
AuthorSchema.post("remove", function () {
  this.constructor.getTotalAddedAuthors(this.user);
});

// Cascade Delete Books when an Author is Deleted
AuthorSchema.pre("remove", async function (next) {
  await this.model("Book").deleteMany({ author: this._id });
  next();
});

module.exports = mongoose.model("Author", AuthorSchema);
