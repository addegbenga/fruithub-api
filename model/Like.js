const mongoose = require("mongoose");

const { Schema } = mongoose;

const likeSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
  },
  productLiked: {
    type: String,
  },

});

module.exports = mongoose.model("likes", likeSchema);
