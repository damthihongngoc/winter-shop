import bcrypt from "bcryptjs";
import * as UserService from "../services/user.service.js";

export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await UserService.getAllUsers({
            page: parseInt(page),
            limit: parseInt(limit),
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const newUser = await UserService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const updatedUser = await UserService.updateUser(req.params.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const changePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const { oldPassword, newPassword } = req.body;

        const user = await UserService.getUserById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check old password
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.status(400).json({ message: "Wrong password" });

        // Hash new password
        const hashed = await bcrypt.hash(newPassword, 10);

        await UserService.changePassword(id, hashed);

        res.json({ message: "Password changed successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        await UserService.deleteUser(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};