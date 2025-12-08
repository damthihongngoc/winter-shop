import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductByCategoryID,
} from "../services/product.service.js";

export const getProducts = async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};
export const getProductByCategory = async (req, res) => {
    try {
        const product = await getProductByCategoryID(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};

export const createNewProduct = async (req, res) => {
    try {
        const data = {
            ...req.body,
            thumbnail: req.file ? `/images/${req.file.filename}` : null,

        }
        const newProduct = await createProduct(data);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
};
export const updateExistingProduct = async (req, res) => {
    try {
        const data = { ...req.body };


        if (req.file) {
            data.thumbnail = `/images/${req.file.filename}`;
        }

        const updatedProduct = await updateProduct(req.params.id, data);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};

export const deleteExistingProduct = async (req, res) => {
    try {
        const result = await deleteProduct(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};