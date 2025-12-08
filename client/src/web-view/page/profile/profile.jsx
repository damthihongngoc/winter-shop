import "./profile.css";

function Profile() {
  // Giả sử dữ liệu user được fetch từ API
  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    bio: "Mình là lập trình viên React, thích công nghệ và bóng đá ⚡",
    avatar: "https://i.pravatar.cc/150?img=3", // avatar mẫu
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={user.avatar} alt="avatar" className="profile-avatar" />
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <p className="profile-bio">{user.bio}</p>
        <button className="edit-btn">Chỉnh sửa hồ sơ</button>
      </div>
    </div>
  );
}

export default Profile;
