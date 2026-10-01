import productModel from "../models/product.model.js"

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

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, stock, price } = req.body

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