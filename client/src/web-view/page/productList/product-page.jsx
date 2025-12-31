import { useParams } from "react-router-dom";
import ProductList from "../../../component/ProductList";

const ProductPage = () => {
  const params = useParams();
  console.log(params);

  return (
    <>
      <ProductList categoryID={params?.id}></ProductList>
    </>
  );
};
export default ProductPage;
