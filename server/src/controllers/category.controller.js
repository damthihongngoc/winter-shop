// controllers/category.controller.js
import { CategoryService } from "../services/category.service.js";

const CategoryController = {
    async getAll(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const result = await CategoryService.getAll({
                page: parseInt(page),
                limit: parseInt(limit),
            });
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const category = await CategoryService.getById(req.params.id);
            if (!category)
                return res.status(404).json({ message: "Category not found" });
            res.json(category);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        console.log("req", req.body);
        try {
            const newCategory = await CategoryService.create(req.body);
            res.status(201).json(newCategory);
        } catch (err) {
            console.log("err", err);
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const updated = await CategoryService.update(req.params.id, req.body);
            res.json(updated);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const result = await CategoryService.remove(req.params.id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

export default CategoryController;