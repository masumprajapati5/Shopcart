import { body, param, validationResult } from 'express-validator'

export const validateProduct = [
    body('name')
        .exists().withMessage("product name is required").bail()
        .isString().withMessage("product name must be a string").bail()
        .trim().isLength({ min: 1 }).withMessage("product name must contain at least 1 character"),
    body("description")
        .exists().withMessage("description is required").bail()
        .isString().withMessage("description must be a string").bail()
        .trim().isLength({ min: 10 }).withMessage("description must contain at least 10 characters"),
    body("price")
        .exists().withMessage("price is required").bail()
        .isFloat({ min: 0 }).withMessage("price must be a valid positive number"),
    body("stock")
        .exists().withMessage("stock is required").bail()
        .isInt({ min: 0 }).withMessage("stock must be an integer greater than or equal to 0"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Validation failed",
                errors: errors.array()
            })
        }
        next()
    }
]

export const validateProductId = [
    param('id')
        .isMongoId().withMessage("Invalid product ID format"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Validation failed",
                errors: errors.array()
            })
        }
        next()
    }
]

export default validateProduct