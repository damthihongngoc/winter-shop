import {
    getAllProductDetailsService,
    getProductDetailByIdService,
    createProductDetailService,
    updateProductDetailService,
    deleteProductDetailService,
    getProductDetailsByCategoryServices,
    getAllProductDetailByIdService,
} from "../services/productDetail.service.js";


export const getAllProductDetails = async(req, res) => {
    try {
        const data = await getAllProductDetailsService();
        res.json(data);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Lỗi server khi lấy danh sách chi tiết sản phẩm" });
    }
};
export const getAllProductDetailById = async(req, res) => {
    try {
        const id = req.params.id;
        const data = await getAllProductDetailByIdService(id);

        if (!data) {
            return res.status(404).json({ message: "Không tìm thấy product detail" });
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi lấy chi tiết sản phẩm" });
    }
};



export const getProductDetailById = async(req, res) => {
    try {
        const detail = await getProductDetailByIdService(req.params.id);
        if (!detail)
            return res
                .status(404)
                .json({ message: "Không tìm thấy chi tiết sản phẩm" });
        res.json(detail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
export const getProductDetailsByCategory = async(req, res) => {
    try {
        console.log("oke");
        const detail = await getProductDetailsByCategoryServices(req.params.id);
        if (!detail)
            return res
                .status(404)
                .json({ message: "Không tìm thấy chi tiết sản phẩm" });
        res.json(detail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
// 🟢 Thêm mới
export const createProductDetail = async(req, res) => {
    try {
        const data = {
            ...req.body,
            image: req.file ? `/images/${req.file.filename}` : null,
        };
        const { product_id, size_id, color_id } = req.body;
        if (!product_id || !size_id || !color_id)
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

        const id = await createProductDetailService(data);
        res.status(201).json({ message: "Thêm thành công", detail_id: id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi thêm chi tiết sản phẩm" });
    }
};

// 🟢 Cập nhật
export const updateProductDetail = async(req, res) => {
    try {
        const data = {
            ...req.body,
            image: req.file ? `/images/${req.file.filename}` : null,
        };
        const affected = await updateProductDetailService(req.params.id, data);
        if (affected === 0)
            return res.status(404).json({ message: "Không tìm thấy để cập nhật" });
        res.json({ message: "Cập nhật thành công" });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Lỗi server khi cập nhật chi tiết sản phẩm" });
    }
};

// 🟢 Xóa
export const deleteProductDetail = async(req, res) => {
    try {
        const affected = await deleteProductDetailService(req.params.id);
        if (affected === 0)
            return res.status(404).json({ message: "Không tìm thấy để xóa" });
        res.json({ message: "Xóa thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi xóa chi tiết sản phẩm" });
    }
};