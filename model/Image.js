const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = new Schema({
  imagename: {
    type: String,
  },
  imagepath: {
    type: String,
  },
});

module.exports = mongoose.model("image", imageSchema);
