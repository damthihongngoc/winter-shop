import multer from "multer";
import path from "path";
import appRootPath from "app-root-path";

// 📁 Cấu hình nơi lưu file
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `${appRootPath}/src/public/images/`);
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

// 🖼️ Bộ lọc chỉ cho phép ảnh
const imageFilter = function(req, file, cb) {
    const allowedExt = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (!allowedExt.test(file.originalname)) {
        req.fileValidationError = "Only image files are allowed!";
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};

// ⚙️ Khởi tạo Multer
const upload = multer({
    storage,
    limits: {
        fieldSize: 100 * 1024 * 1024, // 100MB
    },
    fileFilter: imageFilter,
});

export default upload;