const mongoose = require('mongoose');
const Product = require('../models/product');

exports.get_all_products = (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      res.status(200).json({
        wiadomosc: 'Lista wszystkich produktów',
        szczegoly: docs,
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.add_new_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then((doc) => {
      console.log(doc);
      res.status(201).json({
        wiadomosc: 'Dodano nowy produkt',
        szczegoly: doc,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.get_product_by_id = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      res.status(200).json({
        wiadomosc: 'Szczegóły produktu o nr ' + id,
        szczegoly: doc,
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.update_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndUpdate(
    id,
    { name: req.body.name, price: req.body.price },
    { new: true }
  )
    .exec()
    .then((doc) => {
      res.status(200).json({
        wiadomosc: 'Zmiana produktu o nr ' + id,
        szczegoly: doc,
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndRemove(id)
    .exec()
    .then((doc) => {
      res.status(200).json({
        wiadomosc: 'Usunięto produkt o nr ' + id,
        szczegoly: doc,
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
};