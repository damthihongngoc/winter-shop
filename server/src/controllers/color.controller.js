import colorService from "../services/color.service.js";

export const getAllColors = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await colorService.getAllColors({
            page: parseInt(page),
            limit: parseInt(limit),
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getColorById = async (req, res) => {
    try {
        const color = await colorService.getColorById(req.params.id);
        if (!color) return res.status(404).json({ message: "Color not found" });
        res.json(color);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createColor = async (req, res) => {
    try {
        const { name, hex_code } = req.body;
        const newColor = await colorService.createColor(name, hex_code);
        res.status(201).json(newColor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateColor = async (req, res) => {
    try {
        const { name, hex_code } = req.body;
        const updated = await colorService.updateColor(
            req.params.id,
            name,
            hex_code
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteColor = async (req, res) => {
    try {
        const result = await colorService.deleteColor(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};