const PageLayout = ({ title, extra, children }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "24px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "2px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#333",
            margin: 0,
          }}
        >
          {title}
        </h2>
        {extra}
      </div>

      {children}
    </div>
  );
};

export default PageLayout;
