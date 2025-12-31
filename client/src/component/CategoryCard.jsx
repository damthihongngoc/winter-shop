const cardStyle = {
  width: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  borderRadius: 16,
  overflow: "hidden",
};

const imageWrapperStyle = {
  position: "relative",
  width: "100%",
  aspectRatio: "7 / 10", // thay cho 350x500
  overflow: "hidden",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  display: "block",
  objectFit: "cover",
};

const footerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  background: "#fff",
};

const arrowButtonStyle = {
  border: "none",
  background: "transparent",
  fontSize: 18,
  cursor: "pointer",
};

const CategoryCard = ({ category }) => {
  return (
    <div style={cardStyle}>
      {/* Image */}
      <div style={imageWrapperStyle}>
        <img
          src={category.image || "https://picsum.photos/500/700"}
          alt={category.name}
          style={imageStyle}
        />
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <span style={{ fontWeight: 600 }}>{category.name}</span>
        <button style={arrowButtonStyle}>→</button>
      </div>
    </div>
  );
};

export default CategoryCard;
