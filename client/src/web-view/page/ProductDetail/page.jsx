import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductDetail from "./product-detail";
import NotFoundClothes from "../../../component/NotFound";

export default function ProductDetailWebView() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        if (!id) return;

        // ⭐ ĐỔI API ENDPOINT TỪ product-details/all/:id → products/:id
        const res = await fetch(`http://localhost:3001/api/products/${id}`);
        const json = await res.json();

        // Kiểm tra nếu có data và details
        if (json && json.details && json.details.length > 0) {
          setData(json);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  // ⭐ KIỂM TRA data.details thay vì productDetailMain
  if (!data || !data.details || data.details.length === 0) {
    return <NotFoundClothes />;
  }

  return <ProductDetail productData={data} />;
}
