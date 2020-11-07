// const { boolean } = require("joi");
const mongoose = require("mongoose");
const { schema } = require("./Image");
const Image = require("./Image");

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    productname: {
      type: String,
      required: true,
    },
    productPrice: {
      type: String,
      required: true,
    },
    productQuantity: {
      type: Number,
    },
    productImagePath: {
      type: String,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "image",
    },
    inCart: {
      type: Boolean,
      default: false,
    },
    like: {
      type: Schema.Types.ObjectId,
      ref: "likes",
    },
    liked: [
      {
        author: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("products", productSchema);
