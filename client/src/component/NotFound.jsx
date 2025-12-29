// NotFoundClothes.jsx
import "./style/NotFound.scss";

const NotFoundClothes = () => {
  return (
    <div className="not-found-clothes">
      <div className="content">
        <img
          src="https://cdn-icons-png.flaticon.com/512/892/892458.png"
          alt="No clothes found"
        />
        <h2>Không tìm thấy quần áo phù hợp</h2>
        <p>
          Rất tiếc, chúng tôi không tìm thấy sản phẩm phù hợp với lựa chọn của bạn.
        </p>
        <button onClick={() => window.location.reload()}>
          Thử lại
        </button>
      </div>
    </div>
  );
};

export default NotFoundClothes;
