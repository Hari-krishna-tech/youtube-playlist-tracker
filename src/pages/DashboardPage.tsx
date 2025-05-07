import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import "../styles/DashboardPage.css";

const DashboardPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-navbar">
        <div className="navbar-left" onClick={() => navigate("/dashboard/playlists")}> 
          <span className="ytlearn-logo">YTLearn</span>
        </div>
        <div className="navbar-center">
          <NavLink to="/dashboard/playlists" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>My Playlists</NavLink>
          <NavLink to="/dashboard/add" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Add Playlist</NavLink>
        </div>
        <div className="navbar-right">
          <div className="account-info" onClick={() => setDropdownOpen((v) => !v)}>
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="navbar-avatar" />
            ) : (
              <div className="navbar-avatar-fallback">{user?.name?.[0] || "U"}</div>
            )}
            <span className="navbar-username">{user?.name}</span>
            <span className="navbar-caret">▼</span>
          </div>
          {dropdownOpen && (
            <div className="account-dropdown" onMouseLeave={() => setDropdownOpen(false)}>
              <div className="dropdown-detail">
                <div className="dropdown-avatar-row">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="dropdown-avatar" />
                  ) : (
                    <div className="dropdown-avatar-fallback">{user?.name?.[0] || "U"}</div>
                  )}
                  <div>
                    <div className="dropdown-name">{user?.name}</div>
                    <div className="dropdown-email">{user?.email}</div>
                  </div>
                </div>
              </div>
              <button className="dropdown-logout" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;
