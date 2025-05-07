import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Playlist {
  youtubePlaylistId: string;
  title: string;
  description: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  itemCount: number;
  thumbnailDefaultUrl: string | null;
  thumbnailMediumUrl: string | null;
  thumbnailHighUrl: string | null;
  thumbnailStandardUrl: string | null;
  thumbnailMaxresUrl: string | null;
  totalCompletions: number;
}

const DashboardPlaylists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await api.get("/playlist/");
      setPlaylists(response.data);
    } catch (error) {
      setError("Failed to load playlists");
    }
  };

  return (
    <section className="my-playlists">
      <div className="my-playlists-header">
        <h2>My Playlists</h2>
        <button className="add-playlist-nav-btn" onClick={() => navigate("/dashboard/add")}>+ Add Playlist</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="playlist-grid">
        {playlists.map((playlist) => {
          const percent = playlist.itemCount > 0 ? Math.round((playlist.totalCompletions / playlist.itemCount) * 100) : 0;
          return (
            <div key={playlist.youtubePlaylistId} className="playlist-card">
              <div className="playlist-thumbnail">
                <img 
                  src={playlist.thumbnailHighUrl || playlist.thumbnailMediumUrl || playlist.thumbnailDefaultUrl || ''} 
                  alt={playlist.title}
                />
              </div>
              <div className="playlist-info">
                <h3>{playlist.title}</h3>
                <p className="channel-name">{playlist.channelTitle}</p>
                <p className="video-count">{playlist.itemCount} videos</p>
                <p className="playlist-description">{playlist.description}</p>
                <div className="playlist-progress-bar">
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{width: percent + '%'}} />
                  </div>
                  <div className="progress-bar-label">
                    {playlist.totalCompletions} of {playlist.itemCount} completed ({percent}%)
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardPlaylists; 