import React from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const DashboardPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleTestApiCall = async () => {
    try {
      const response = await api.get("/youtube/playlist/details", {
        params: {
          url: "https://youtube.com/playlist?list=PLdpzxOOAlwvLNOxX0RfndiYSt1Le9azze&si=Ypj5WpPNIww0kVD3",
        },
      });
      const response2 = await api.get("/youtube/playlist/items", {
        params: {
          url: "https://youtube.com/playlist?list=PLdpzxOOAlwvLNOxX0RfndiYSt1Le9azze&si=Ypj5WpPNIww0kVD3",
        },
      });
      const response3 = await api.post("/playlist/", {
        url: "https://youtube.com/playlist?list=PLdpzxOOAlwvLNOxX0RfndiYSt1Le9azze&si=Ypj5WpPNIww0kVD3",
      });
      console.log("pretty response", response.data);
      console.log("pretty response2", response2.data);
      console.log("pretty response3", response3.data);
    } catch (error) {
      console.error("API call failed", error);
      // Handle error if needed
    }
  };
  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <p>
          Welcome, {user.name}! ({user.email})!
        </p>
      ) : (
        <p>Loading user data... </p>
      )}
      <button onClick={handleTestApiCall}>Test API Call</button>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
