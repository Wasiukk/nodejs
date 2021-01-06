const express = require('express');
const multer = require('multer');

const ProductController = require('../controllers/products');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(':', '_').replace(':', '_') +
        file.originalname
    );
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

const router = express.Router();

router.get('/', ProductController.get_all_products);

router.post(
  '/',
  upload.single('productImage'),
  checkAuth,
  ProductController.add_new_product
);

router.get('/:productId', ProductController.get_product_by_id);

router.patch('/:productId', checkAuth, ProductController.update_product);

router.delete('/:productId', checkAuth, ProductController.delete_product);

module.exports = router;
