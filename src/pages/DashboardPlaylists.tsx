import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Playlist {
  id: number;
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
      console.log(response.data);
      setPlaylists(response.data);
    } catch (error) {
      setError("Failed to load playlists");
    }
  };

  const handlePlaylistClick = (playlistId: number) => {
    navigate(`/dashboard/playlist/${playlistId}`);
  };

  return (
    <section className="my-playlists">
      <div className="my-playlists-header">
        <h2>My Playlists</h2>
        <button className="add-playlist-nav-btn" onClick={() => navigate("/dashboard/add")}>+ Add Playlist</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="playlist-grid">
        {playlists.length === 0 ? (
          <div className="no-playlists-message">
            <p>You don't have any playlists yet. Add a playlist to start learning!</p>
          </div>
        ) : (
          playlists.map((playlist) => {
            const percent = playlist.itemCount > 0 ? Math.round((playlist.totalCompletions / playlist.itemCount) * 100) : 0;
            return (
              <div 
                key={playlist.youtubePlaylistId} 
                className="playlist-card"
                onClick={() => handlePlaylistClick(playlist.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handlePlaylistClick(playlist.id);
                  }
                }}
              >
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
          })
        )}
      </div>
    </section>
  );
};

export default DashboardPlaylists; 