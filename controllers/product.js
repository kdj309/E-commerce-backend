const Product = require("../models/Product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { validationResult } = require("express-validator");
const Size = require("../models/Size");
//middleware for products
exports.getproductById = (req, res, next, id) => {
  // console.log(id);
  Product.findById(id)
    .populate("category")
    .populate({ path: "size", select: "name _id" })
    .select("-image")
    .then((product) => {
      // console.log(product);
      if (!product) {
        return res.status(404).json({ errormsg: "product not Found" });
      }
      req.product = product;
      next();
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ errormsg: "product not Found" });
    });
};
//getproduct
//
exports.getProduct = (req, res) => {
  // console.log(req.product);
  return res.json(req.product);
};
//Create product
//! exports.CreateProduct = (req, res) => {
//!     //console.log("req.body",req.body);
//!     let form = formidable.IncomingForm()
//!     form.keepExtensions = true;
//!     form.parse(req, (err, fields, file) => {
//!         const { name, description, price, Availabelstock, category } = fields
//!         if (!name || !description || !price || !category) {
//!             return res.status(400).json({ errormsg: "Fields must be not empty" });
//!         }
//!         if (err) {
//!             return res.status(404).json({ errormsg: "File not Found" })
//!         }
//!         console.log(file)

//!         let tshirt = new Product(fields)
//!         if (file.image) {
//!             if (file.image.size > 3000000) {
//!                 return res.status(404).json({ errormsg: "image size is too big" })
//!             }
//!             tshirt.image.data = fs.readFileSync(file.image.path)
//!             tshirt.image.contentType = file.image.type
//!         }
//!         tshirt.save((err, tshirt) => {
//!             if (!tshirt || err) {
//!                 return res.status(404).json({ errormsg: "failed to save tshirt in DB" })
//!             }
//!             res.status(200).json(tshirt)
//!         })
//!     })
//! }
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    // console.log(file, fields);
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    //destructure the fields
    const { name, description, price, category, Availabelstock } = fields;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let product = new Product(fields);

    //handle file here
    // console.log();
    if (file.image) {
      if (file.image.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.image.data = fs.readFileSync(file.image.path);
      product.image.contentType = file.image.type;
      //   console.log(product);
    }
    // console.log(product);

    //save to the DB
    product.save((err, product) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          error: "Saving tshirt in DB failed",
        });
      }
      res.json(product);
    });
  });
};
//*middleware to handle image
exports.imagehadler = (req, res) => {
  // console.log(req.params.productid)
  // // if (req.product.image.data) {
  // //     res.set("Content-type", req.product.image.contentType)
  // //     return res.send(req.product.image.data)
  // // }
  Product.findById(req.params.productid)
    .select("image")
    .then((product) => {
      if (!product) {
        return res.status(404).json({ errormsg: "product not Found" });
      }
      if (product.image.data) {
        res.set("Content-type", product.image.contentType);
        return res.send(product.image.data);
      }
    })
    .catch((error) => {
      return res.status(500).json({ errormsg: "product not Found" });
    });
};
//updating a product
exports.Updateprodcut = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    const { name, description, price, Availabelstock, category, size } = fields;

    console.log(name, description, price, Availabelstock, category, size);
    if (err) {
      return res.status(404).json({ errormsg: "File not Found" });
    }
    let tshirt = req.product;

    tshirt = _.extend(tshirt, fields);
    if (file.image) {
      if (file.image.size > 3000000) {
        return res.status(404).json({ errormsg: "image size is too big" });
      }
      tshirt.image.data = fs.readFileSync(file.image.path);
      tshirt.image.contentType = file.image.type;
    }
    tshirt.save((err, tshirt) => {
      if (!tshirt || err) {
        return res
          .status(404)
          .json({ errormsg: "failed to Update tshirt in DB" });
      }
      res.status(200).json(tshirt);
    });
  });
};
//deleting a product
exports.Deleteprodcut = (req, res) => {
  let tshirt = req.product;
  tshirt.remove((err, Tshirt) => {
    if (!Tshirt || err) {
      return res.status(404).json({ errormsg: "Failed to delete a product" });
    }
    return res.status(200).json(Tshirt);
  });
};
//getting all products
exports.getAllproducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 16;
  let sortBy = req.query.sortby ? req.query.sortby : "_id";
  Product.find({})
    .select("-image")
    .populate({ path: "size", select: "name _d" })
    .populate({ path: "category", select: "name" })
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .then((product) => {
      return res.status(200).json(product);
    })
    .catch((err) => {
      return res
        .status(404)
        .json({ errormsg: `Failed to load a products ${err}` });
    });
};
//middleware to handle Availablestock count and sold count
exports.UpdateSoldAndstockCount = (req, res, next) => {
  // console.log(req.body.products);
  if(req.body.order.Status == "Canceled"){
    next()
  }else{
    let Bulkoperations = req.body.order.products.map((product) => {
      return {
        updateOne: {
          filter: { _id: product.product._id },
          update: {
            $inc: {
              Availabelstock: -product.product.quantity,
              soldStocks: +product.product.quantity,
            },
          },
        },
      };
    });
    Product.bulkWrite(Bulkoperations, {}, (err, products) => {
      // console.log(products)
      if (err) {
        return res
          .status(404)
          .json({ errormsg: `bulk operations failed ${err}` });
      }
      next();
    });
  }
  
};
//geting unique categories
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(404).json({ errormsg: "Failed to load categories" });
    }
    res.status(200).json(categories);
  });
};

exports.getAllUniqueSizeoptions = (req, res) => {
  Product.distinct("size", {})
    .then((ids) => {
      Size.find({ _id: { $in: ids } }, function (err, result) {
        return res.status(200).json(result);
      });
    })
    .catch((err) => {
      return res.status(404).json({ errormsg: "Failed to load sizeoptions" });
    });
};
