const express = require("express");
const Productmodel = require("../model/Productmodel");
const multer = require("multer");
const auth = require("../middleware/auth");
const User = require("../model/User");
const Like = require("../model/Like");

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const upload = multer();

const router = express.Router();

//get all product liked by a particular author
// router.get("/getLiked", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//   const product = await Productmodel.find({"liked.author":user.id}).populate("liked.author")
//    let txt = product.map(res => res.liked);
//    const index = txt.map(res => res._id)
//     res.json(index)
//   } catch (error) {
//     res.status(500).send("Server Error");
//     console.log(error);
//   }
// });

//routes to get list of all products

router.get("/all", async (req, res) => {
  try {
    const product = await Productmodel.find()
      .populate("author")
      .populate("like");
    return res.json({
      message: "success",
      data: product,
    });
  } catch (error) {
    res.status(500).send("server error");
    console.log(error);
  }
});

//get all likes on a product

router.get("/alllike", auth, async (req, res) => {
  try {
    const like = await Like.find({ author: req.user.id })
      .populate("author")
      .populate("product");
    res.json(like);
  } catch (error) {
    res.status(500).send("error");
    console.log(error);
  }
});

router.post("/addlike", auth, async (req, res) => {
  try {
    const newLike = new Like({
      author: req.user.id,
      product: req.body.product,
    });
    const liked = await newLike.save();
    res.json(liked);
  } catch (error) {
    res.status(500).send("server error");
  }
});

//routes to get a single products

router.get("/:id", async (req, res) => {
  try {
    const product = await Productmodel.findById(req.params.id);
    res.json({
      message: "success",
      data: product,
    });
  } catch (error) {
    res.status(500).send("server error");
    console.log(error);
  }
});

//route to add products
router.post("/add", upload.single("file"), auth, async (req, res, next) => {
  try {
    const file = req.file;
    if (file.detectedFileExtension !== ".png")
      next(new Error("invalid file type"));

    const fileName =
      req.body.productname +
      Math.floor(Math.random() * 1000) +
      file.detectedFileExtension;
    await pipeline(
      file.stream,
      fs.createWriteStream(
        `${__dirname}/../../myapp/public/uploads/${fileName}`
      )
    );
    productImagePath = `uploads/${fileName}`;

    const user = await User.findById(req.user.id);
    console.log(user);
    const newProduct = new Productmodel({
      productname: req.body.productname,
      productPrice: req.body.productPrice,
      productQuantity: req.body.productQuantity,
      author: user.id,
      productImagePath: productImagePath,
    });

    const savedProduct = await newProduct.save();
    res.json({
      message: "success",
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).send("server errror");
    console.log(error);
  }
});

//routes to delete products

router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const product = await Productmodel.findById(req.params.id);
    await product.remove();
    res.json({
      message: "deleted successfully",
    });
  } catch (error) {
    res.status(500).send("serve error");
    console.log(error);
  }
});

// routes to update products

router.post("/update/:id", auth, async (req, res) => {
  try {
    const { productname, productPrice } = req.body;

    const productfields = {
      productname,
      productPrice,
    };

    const product = await Productmodel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: productfields },
      { new: true, upsert: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).send("server error");
    console.log(error);
  }
});

router.put("/like", auth, async (req, res) => {
  try {
    const product = await Productmodel.findById({ _id: req.body.id });

    // Check if the post has already been liked
    if (product.liked.some((like) => like.author.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Product already liked" });
    }

    product.liked.unshift({ author: req.user.id });

    await product.save();

    return res.json(product.liked);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.put("/unlike", auth, async (req, res) => {
  try {
    const product = await Productmodel.findById({ _id: req.body.id });

    // Check if the post has not yet been liked
    if (!product.liked.some((like) => like.author.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // remove the like
    product.liked = post.liked.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await product.save();

    return res.json(product.liked);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
