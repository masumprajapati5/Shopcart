import express from 'express'
import { validateProduct, validateProductId } from '../validators/product.validator.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product.controller.js'

const router = express.Router()

// Create product (Protected)
router.post('/', authenticate, validateProduct, createProduct)

// List all products (Public - optional pagination supported)
router.get("/", getProducts)

// Get single product by ID (Public - validates :id)
router.get("/:id", validateProductId, getProduct)

// Update product (Protected - validates :id and body)
router.put("/:id", authenticate, validateProductId, validateProduct, updateProduct)

// Delete product (Protected - validates :id)
router.delete("/:id", authenticate, validateProductId, deleteProduct)

export default router