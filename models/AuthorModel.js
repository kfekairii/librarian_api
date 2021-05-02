const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema(
  {
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

// Cascade Delete Books when an Author is Deleted
AuthorSchema.pre("remove", async function (next) {
  await this.model("Book").deleteMany({ author: this._id });
  next();
});

module.exports = mongoose.model("Author", AuthorSchema);
