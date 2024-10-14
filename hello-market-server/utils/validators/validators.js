const { body } = require('express-validator');

const registerValidator = [
    body('username', 'username cannot be empty.').not().isEmpty(),
    body('password', 'password cannot be empty.').not().isEmpty()
];
  
const loginValidator = [
    body('username', 'username cannot be empty.').not().isEmpty(),
    body('password', 'password cannot be empty.').not().isEmpty()
];

const productValidator = [
    body('name', 'name cannot be empty.').not().isEmpty(), 
    body('description', 'description cannot be empty.').not().isEmpty(), 
    body('price', 'price cannot be empty.').not().isEmpty(), 
    body('photo_url')
      .notEmpty().withMessage('photoUrl cannot be empty.')
]

module.exports = {
    registerValidator,
    loginValidator, 
    productValidator
};