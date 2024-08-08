const { validationResult } = require("express-validator");
const Product = require("../models/product");
const mongoose = require("mongoose");
const fileHelper = require("../util/file");
const product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const image = req.file;
  const description = req.body.description;
  const errors = validationResult(req);
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      errorMessage: "The attached file no valid",
      validationErrors: [],
    });
  }
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const imageUrl = image.path;
  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        product: product,
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImage = req.file;
  const updatedDescription = req.body.description;
  const errors = validationResult(req);

  if (!updatedImage) {
    return res.status(422).render("admin/edit-product", {
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId,
      },
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: true,
      errorMessage: "The attached file no valid",
      validationErrors: [],
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId,
      },
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      fileHelper.deleteFile(product.imageUrl);
      product.imageUrl = updatedImage.path;
      product.description = updatedDescription;
      product.save().then((result) => {
        console.log("Updated Product!");
        return res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId' , 'name')
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("No product found !"));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      res.status(200).json({message : 'Success'});
    })
    .catch((err) => {
      res.status(500).json({message: 'Deleted product failed'});
    });
};
