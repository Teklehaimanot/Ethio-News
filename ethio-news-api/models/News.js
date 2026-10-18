const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // This could be a URL or a reference to an image file
    required: true,
  },
  source: {
    type: String,
    required: false,
  },
  sourceUrl: {
    type: String,
    required: false,
  },
  isImported: {
    type: Boolean,
    default: false,
  },
  importedAt: {
    type: Date,
  },
  externalId: {
    type: String,
  },
  contentHash: {
    type: String,
  },
  importedVia: {
    type: String,
  },
  content: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Reference to a User model if you have one
      },
      comment: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
