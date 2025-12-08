import pool from "../config/db.js";

/* -------------------- GET CART BY USER -------------------- */
const URL = `http://localhost:` + process.env.PORT;

export const getCartByUserService = async (userId) => {
    const [cart] = await pool.query(
        "SELECT * FROM carts WHERE user_id = ? LIMIT 1", [userId]
    );

    if (cart.length === 0) {
        return { cart: null, items: [] };
    }

    const cartId = cart[0].cart_id;

    const [items] = await pool.query(
        `
        SELECT ci.cart_item_id, ci.quantity,
               pd.detail_id,
               pd.price,
               pd.image,
               s.name AS size,
               c.name AS color,
               p.name AS product_name
        FROM cart_items ci
        JOIN product_details pd ON ci.detail_id = pd.detail_id
        JOIN sizes s ON pd.size_id = s.size_id
        JOIN colors c ON pd.color_id = c.color_id
        JOIN products p ON pd.product_id = p.product_id
        WHERE ci.cart_id = ?
        `, [cartId]
    );

    //Thêm URL ảnh
    const outputItems = items.map(item => ({
        ...item,
        image: item.image ? URL + item.image : null,
    }));

    return {
        cart: cart[0],
        items: outputItems
    };
};


/* -------------------- ADD TO CART -------------------- */
export const addToCartService = async ({ user_id, detail_id, quantity }) => {

    // 1. Kiểm tra user đã có cart chưa → nếu chưa thì tạo
    let [cartRows] = await pool.query(
        "SELECT * FROM carts WHERE user_id = ? LIMIT 1", [user_id]
    );

    let cartId = null;

    if (cartRows.length === 0) {
        const [result] = await pool.query(
            "INSERT INTO carts (user_id) VALUES (?)", [user_id]
        );
        cartId = result.insertId;
    } else {
        cartId = cartRows[0].cart_id;
    }

    // 2. Kiểm tra sản phẩm đã có trong giỏ chưa
    const [existing] = await pool.query(
        "SELECT * FROM cart_items WHERE cart_id = ? AND detail_id = ?", [cartId, detail_id]
    );

    if (existing.length > 0) {
        // Nếu đã tồn tại → tăng số lượng
        await pool.query(
            "UPDATE cart_items SET quantity = quantity + ? WHERE cart_item_id = ?", [quantity, existing[0].cart_item_id]
        );

        return { message: "Quantity updated", cart_item_id: existing[0].cart_item_id };
    }

    // 3. Nếu chưa tồn tại → thêm mới
    const [insert] = await pool.query(
        "INSERT INTO cart_items (cart_id, detail_id, quantity) VALUES (?, ?, ?)", [cartId, detail_id, quantity]
    );

    return { message: "Added to cart", cart_item_id: insert.insertId };
};

/* -------------------- UPDATE QUANTITY -------------------- */
export const updateCartItemService = async (cartItemId, quantity) => {
    await pool.query(
        "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?", [quantity, cartItemId]
    );
    return { message: "Cart item updated" };
};

/* -------------------- DELETE ITEM -------------------- */
export const deleteCartItemService = async (cartItemId) => {
    await pool.query("DELETE FROM cart_items WHERE cart_item_id = ?", [cartItemId]);
    return { message: "Cart item deleted" };
};

/* -------------------- CLEAR CART -------------------- */
export const clearCartService = async (userId) => {
    const [cart] = await pool.query(
        "SELECT cart_id FROM carts WHERE user_id = ? LIMIT 1", [userId]
    );

    if (cart.length === 0) return { message: "Cart already empty" };

    await pool.query("DELETE FROM cart_items WHERE cart_id = ?", [cart[0].cart_id]);
    return { message: "Cart cleared" };
};