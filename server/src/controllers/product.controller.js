import productModel from "../models/product.model.js"

// Create product (Protected)
export const createProduct = async (req, res) => {
    try {
        const { name, description, stock, price } = req.body

        const product = await productModel.create({
            name,
            description,
            stock: Number(stock),
            price: Number(price)
        })

        return res.status(201).json({
            message: "Product created successfully",
            data: {
                product
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// List all products (Public - supports optional pagination: ?page=1&limit=10)
export const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit)

        let query = productModel.find().sort({ createdAt: -1 })

        if (limit && limit > 0) {
            const skip = (page - 1) * limit
            query = query.skip(skip).limit(limit)
            const total = await productModel.countDocuments()
            const products = await query

            return res.status(200).json({
                message: "Products fetched successfully",
                data: {
                    products,
                    pagination: {
                        total,
                        page,
                        pages: Math.ceil(total / limit),
                        limit
                    }
                }
            })
        }

        const products = await query
        return res.status(200).json({
            message: "Products fetched successfully",
            data: {
                products
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Get single product by ID (Public - confirms existence)
export const getProduct = async (req, res) => {
    try {
        const { id } = req.params

        const product = await productModel.findById(id)
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        return res.status(200).json({
            message: "Product fetched successfully",
            data: {
                product
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Update product (Protected - confirms existence first)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, stock, price } = req.body

        // First check if product exists
        const existingProduct = await productModel.findById(id)
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        existingProduct.name = name ?? existingProduct.name
        existingProduct.description = description ?? existingProduct.description
        existingProduct.price = price !== undefined ? Number(price) : existingProduct.price
        existingProduct.stock = stock !== undefined ? Number(stock) : existingProduct.stock

        const updatedProduct = await existingProduct.save()

        return res.status(200).json({
            message: "Product updated successfully",
            data: {
                product: updatedProduct
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Delete product (Protected - confirms existence first)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const existingProduct = await productModel.findById(id)
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        await productModel.findByIdAndDelete(id)

        return res.status(200).json({
            message: "Product deleted successfully",
            data: {
                product: existingProduct
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}