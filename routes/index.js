




const express = require("express");
const router = express.Router();
const Image = require("../model/Image");
const multer = require("multer");

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);




/* GET home page. */
 router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
 });








const upload = multer();
router.post("/upload", upload.single("file"), async (req, res, next) => {
  // console.log(req.file);
  const {
    file,
    body: { name },
  } = req;
  if (file.detectedFileExtension !== ".mp4")
    next(new Error("invalid file type"));

  const fileName =
    name + Math.floor(Math.random() * 1000) + file.detectedFileExtension;
  await pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../../client/public/uploads/${fileName}`)
   
  );
 
  const imagepath = `uploads/${fileName}`;
  const newImage = new Image({
    imagename: name,
    imagepath: imagepath,
  });

  const savedImage = await newImage.save();
  return res.json({
    filename: savedImage.imagename,
    filepath: savedImage.imagepath,
  });
 
});



 // res.json(savedImage);
 // fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
  // const readStream = fs.createReadStream(
  //   `${__dirname}/../public/images/${fileName}`
  // );

router.get("/getall", async (req, res) => {
  const image = await Image.find();

  res.json(image);
});

module.exports = router;
