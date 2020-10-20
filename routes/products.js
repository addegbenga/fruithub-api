const express = require("express");
const { schema } = require("../model/Productmodel");
const Productmodel = require("../model/Productmodel");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    msg: "helloo world",
  });
});

//routes to get list of all products

router.get("/all", async (req, res) => {
  try {
    const product = await Productmodel.find();
    return res.json({
      message: "success",
      data: product,
    });
  } catch (error) {
    res.status(500).send("server error");
    console.log(error);
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
router.post("/add", async (req, res) => {
  try {
    const newProduct = new Productmodel({
      productname: req.body.productname,
      productPrice: req.body.productPrice,
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

router.delete("/delete/:id", async (req, res) => {
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

router.post("/update/:id", async (req, res) => {
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
    res.json(product)
  } catch (error) {
    res.status(500).send("server error");
    console.log(error);
  }
});

module.exports = router;
