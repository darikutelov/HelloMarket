
const models = require('../models')
const multer = require('multer')
const path =  require('path')
const { validationResult } = require('express-validator');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify the destination folder for uploaded images
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      // Generate a unique filename for each uploaded file
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {

      // Accept only images (jpeg, jpg, png)
      const fileTypes = /jpeg|jpg|png/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimeType = fileTypes.test(file.mimetype);
      


      if (mimeType && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only images are allowed!'));
      }
    }
  }).single('image');

exports.upload = async (req, res) => {

    uploadImage(req, res, (err) => {

        if (err) {
          return res.status(400).send({ message: err.message, success: false });
        }
        if (!req.file) {
          return res.status(400).send({ message: 'No file uploaded', success: false });
        }

        // Construct the full URL for the uploaded file
        const baseUrl = `${req.protocol}://${req.get('host')}`; // e.g., http://localhost:3000
        const filePath = `/uploads/${req.file.filename}`; // Assuming your files are served from /uploads
        const downloadURL = `${baseUrl}${filePath}`;

        res.send({ message: 'File uploaded successfully', downloadURL: downloadURL, success: true });
      });
}

exports.getAllProducts = async (req, res) => {
    const products = await models.Product.findAll({})
    res.json(products)
}

exports.getMyProducts = async (req, res) => {
    try {
        const userId = req.params.userId
        console.log(userId)
        const products = await models.Product.findAll({
          where: {
            user_id: userId 
          }
        })
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', success: false });
    }
}

exports.create = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const msg = errors.array().map(error => error.msg).join('')
        return res.status(422).json({ message: msg, success: false });
    }


    const { name, description, price, photo_url, user_id } = req.body
    console.log(req.body)

    try {
        const newProduct = await models.Product.create({
            name: name,
            description: description,
            price: price,
            photo_url: photo_url, 
            user_id: user_id 
        });

        // Return success response with the created product
        return res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}