import express from 'express'
import { validateProduct, validateProductId } from '../validators/product.validator.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product.controller.js'

const router = express.Router()

router.post('/', authenticate, validateProduct, createProduct)

router.get("/", getProducts)

router.get("/:id", validateProductId, getProduct)

router.put("/:id", authenticate, validateProductId, validateProduct, updateProduct)

router.delete("/:id", authenticate, validateProductId, deleteProduct)

export default router