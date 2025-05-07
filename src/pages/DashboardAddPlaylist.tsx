import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const DashboardAddPlaylist: React.FC = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);
    try {
      await api.post("/playlist/", { url: playlistUrl });
      setPlaylistUrl("");
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/playlists"), 1000);
    } catch (error) {
      setError("Failed to add playlist. Please check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="add-playlist">
      <div className="add-playlist-header">
        <h2>Add New Playlist</h2>
        <button className="back-to-playlists-btn" onClick={() => navigate("/dashboard/playlists")}>← My Playlists</button>
      </div>
      <form onSubmit={handleSubmit} className="playlist-form">
        <input
          type="text"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
          placeholder="Enter YouTube Playlist URL"
          className="playlist-input"
          required
        />
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Playlist"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Playlist added! Redirecting...</p>}
    </section>
  );
};

export default DashboardAddPlaylist; 