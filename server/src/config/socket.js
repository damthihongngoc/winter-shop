import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // Middleware xác thực
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication error"));
        }

        try {
            const decoded = jwt.verify(token, process.env.KEY_SECRET);
            socket.userId = decoded.user_id;
            socket.userRole = decoded.role;
            next();
        } catch (err) {
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.userId} (${socket.userRole})`);

        // Join room theo role
        if (socket.userRole === "admin") {
            socket.join("admins");
            console.log(`Admin ${socket.userId} joined admins room`);
        } else {
            socket.join(`user_${socket.userId}`);
            console.log(`User ${socket.userId} joined personal room`);
        }

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

// Helper functions để emit notifications
export const notifyUser = (userId, notification) => {
    const io = getIO();
    io.to(`user_${userId}`).emit("notification", notification);
};

export const notifyAdmins = (notification) => {
    const io = getIO();
    io.to("admins").emit("notification", notification);
};

export const notifyAll = (notification) => {
    const io = getIO();
    io.emit("notification", notification);
};