import sizeService from "../services/size.service.js";

export const getAllSizes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await sizeService.getAllSizes({
            page: parseInt(page),
            limit: parseInt(limit),
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSizeById = async (req, res) => {
    try {
        const size = await sizeService.getSizeById(req.params.id);
        if (!size) return res.status(404).json({ message: "Size not found" });
        res.json(size);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSize = async (req, res) => {
    try {
        const { name } = req.body;
        const newSize = await sizeService.createSize(name);
        res.status(201).json(newSize);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSize = async (req, res) => {
    try {
        const { name } = req.body;
        const updated = await sizeService.updateSize(req.params.id, name);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSize = async (req, res) => {
    try {
        const result = await sizeService.deleteSize(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};