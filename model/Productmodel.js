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
      type: String,
    },
    productImagePath:{
      type:String
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "image",
    },
    like:{
        type:Schema.Types.ObjectId,
        ref:"likes"
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
