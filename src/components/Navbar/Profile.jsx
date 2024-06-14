import userLogo from "../../assets/user.png";

import "./Profile.css";

const Profile = ({ user, onClick }) => {
  return (
    <div className="user-card">
      <div className="userProfile">
        <img src={userLogo} alt="_userLogo" width="40px" />
      </div>
      <h3 className="user-card__name">{user?.loginResponse?.BusinessName}</h3>
      <address className="user-card__link">
        {user?.loginResponse?.BranchAddress}
      </address>

      <button className="logoutBtn" onClick={onClick}>
        logout
      </button>
    </div>
  );
};

export default Profile;
