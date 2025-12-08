import * as BannerService from "../services/banner.service.js";

export const getBanners = async (req, res) => {
    try {
        const banners = await BannerService.getAllBanners();
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getPublicBanners = async (req, res) => {
    try {
        const banners = await BannerService.getAllBanners();
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBanner = async (req, res) => {
    try {
        const banner = await BannerService.getBannerById(req.params.id);
        if (!banner) return res.status(404).json({ message: "Banner not found" });
        res.json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createBanner = async (req, res) => {
    try {
        const data = {
            ...req.body,
            image: req.file ? `/images/${req.file.filename}` : null,

        }
        const newBanner = await BannerService.createBanner(data);
        res.status(201).json(newBanner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateBanner = async (req, res) => {
    try {
        const data = {
            ...req.body,
            image: req.file ? `/images/${req.file.filename}` : null,

        }
        const updated = await BannerService.updateBanner(req.params.id, data);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteBanner = async (req, res) => {
    try {
        const result = await BannerService.deleteBanner(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};