import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import './sidebar.css';

const Sidebar = () => {
  const [userName, setUserName] = useState('HATLAB');
  const [userEmail, setUserEmail] = useState('Hatlab@gmail.com');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie('access_token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      setUserName(decodedToken.sub.name);
      setUserEmail(decodedToken.sub.email);
    }
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleSignOut = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="logo-pop">
          <button onClick={() => window.location.reload()} className="logo-button">
            <img className="logo-image" src="/logo.png" alt="logo" />
            <div className="logo-text">HATLAB</div>
          </button>
        </div>
        <div className="menu">
          <div className="menu-item active">
            <i className="icon chats-icon"></i>
            Chats
          </div>
          <div className="menu-item">
            <i className="icon search-icon"></i>
            Search
          </div>
          <div className="menu-item">
            <i className="icon subscription-icon"></i>
            Manage Subscription
          </div>
          <div className="menu-item">
            <i className="icon faq-icon"></i>
            Update & FAQ
          </div>
          <div className="menu-item">
            <i className="icon settings-icon"></i>
            Settings
          </div>
          <hr className="divider" />
          <div className="menu-item">
            <i className="icon favourite-icon"></i>
            Favourite chats
          </div>
          <div className="menu-item">
            <i className="icon pin-icon"></i>
            Pin chats
          </div>
          <div className="menu-item">
            <i className="icon archive-icon"></i>
            Archived chats
          </div>
        </div>
      </div>
      <div className="sidebar-footer">
        <div className="profile">
          <div className="profile-info">
            <img src="/name.png" alt="Hatlab" className="profile-image" />
            <div className="profile-text">
              <h2>{userName}</h2>
              <p>{userEmail}</p>
            </div>
          </div>
          <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
