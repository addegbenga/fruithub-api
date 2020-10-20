const mongoose = require("mongoose");
const { schema } = require("./Image");
const Image = require("./Image");

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    author: {
      type: String,
      ref: "user",
    },
    productname: {
      type: String,
      required: true,
    },
    productPrice: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", productSchema);
