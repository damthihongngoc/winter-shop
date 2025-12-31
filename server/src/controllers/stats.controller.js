import * as StatsService from "../services/stats.service.js";

export const getOverviewStats = async (req, res) => {
    try {
        const stats = await StatsService.getOverviewStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRevenueStats = async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const stats = await StatsService.getRevenueStats(parseInt(days));
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOrderStatusStats = async (req, res) => {
    try {
        const stats = await StatsService.getOrderStatusStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTopProducts = async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const stats = await StatsService.getTopProducts(parseInt(limit));
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCategoryStats = async (req, res) => {
    try {
        const stats = await StatsService.getCategoryStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};