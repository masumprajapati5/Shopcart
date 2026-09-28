import { body, param, validationResult } from "express-validator"

export const registerValidator = [
    body('name')
        .exists().withMessage("name is required").bail()
        .isString().withMessage("name should be in string format").bail()
        .trim().isLength({ min: 2, max: 20 }).withMessage("name should be between 2 to 20 characters"),
    body('email')
        .exists().withMessage("email is required").bail()
        .isEmail().withMessage("invalid email format").bail()
        .normalizeEmail(),
    body('password')
        .exists().withMessage("password is required").bail()
        .isLength({ min: 6 }).withMessage("password should be at least 6 characters long"),
    body('confirmPassword')
        .exists().withMessage("confirmPassword is required").bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("confirmPassword does not match password")
            }
            return true
        }),
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

export const loginValidator = [
    body('email')
        .exists().withMessage("email is required").bail()
        .isEmail().withMessage("invalid email format").bail()
        .normalizeEmail(),
    body('password')
        .exists().withMessage("password is required").bail()
        .notEmpty().withMessage("password cannot be empty"),
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