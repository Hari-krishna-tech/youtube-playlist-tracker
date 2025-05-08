import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/PlaylistDetailPage.css';
import LoadingSpinner from '../components/LoadingSpinner';

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
  totalInProgress: number;
}

interface Video {
  id: number;
  youtubePlaylistItemId: string;
  youtubeVideoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailDefaultUrl: string | null;
  thumbnailMediumUrl: string | null;
  thumbnailHighUrl: string | null;
  etag: string;
  videoOwnerChannelId: string;
  videoOwnerChannelTitle: string;
  position: string;
  status: 'INCOMPLETE' | 'IN_PROGRESS' | 'COMPLETE';
  note: { id: number; content: string } | null;
  createdAt: string;
  updatedAt: string;
}

const MAX_DESCRIPTION_LINES = 3;

const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteInput, setNoteInput] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const response = await api.get(`/playlist/details/${id}`);
        setPlaylist(response.data);
      } catch (error) {
        console.error('Error fetching playlist details:', error);
      }
    };

    const fetchVideos = async () => {
      try {
        const response = await api.get(`/playlist/${id}`);
        setVideos(response.data);
        if (response.data.length > 0) {
          setSelectedVideo(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
    fetchVideos();
  }, [id]);

  // When selectedVideo changes, set note input and mark as in progress if needed
  useEffect(() => {
    if (selectedVideo) {
      setNoteInput(selectedVideo.note?.content || '');
      setDescExpanded(false);
      if (selectedVideo.status === 'INCOMPLETE') {
        markInProgress(selectedVideo.id);
      }
    }
    // eslint-disable-next-line
  }, [selectedVideo?.id]);

  const markInProgress = async (videoId: number) => {
    try {
      await api.post('/video/', { id: videoId, status: 'IN_PROGRESS' });
      setVideos(videos => videos.map(v => v.id === videoId && v.status !== 'COMPLETE' ? { ...v, status: 'IN_PROGRESS' } : v));
      if (selectedVideo && selectedVideo.id === videoId && selectedVideo.status !== 'COMPLETE') {
        setSelectedVideo({ ...selectedVideo, status: 'IN_PROGRESS' });
      }
    } catch (e) {
      // ignore
    }
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setSidebarOpen(false); // close sidebar on mobile when selecting a video
  };

  // Toggle between COMPLETE and IN_PROGRESS
  const handleToggleComplete = async (video: Video) => {
    if (video.status === 'COMPLETE') {
      // Set to IN_PROGRESS
      try {
        const response = await api.post('/video/', {
          id: video.id,
          status: 'IN_PROGRESS',
        });
        if (response.status === 200) {
          setVideos(videos.map(v => v.id === video.id ? { ...v, status: 'IN_PROGRESS' } : v));
          setSelectedVideo({ ...video, status: 'IN_PROGRESS' });
        }
      } catch (error) {
        // handle error
      }
    } else {
      // Set to COMPLETE
      try {
        const response = await api.post('/video/', {
          id: video.id,
          status: 'COMPLETE',
        });
        if (response.status === 200) {
          setVideos(videos.map(v => v.id === video.id ? { ...v, status: 'COMPLETE' } : v));
          setSelectedVideo({ ...video, status: 'COMPLETE' });
        }
      } catch (error) {
        // handle error
      }
    }
  };

  const handleNoteSave = async () => {
    if (!selectedVideo) return;
    setNoteSaving(true);
    try {
      const response = await api.post('/video/', {
        id: selectedVideo.id,
        note: {
          content: noteInput,
        }
      });
      if (response.status === 200) {
        setVideos(videos.map(video =>
          video.id === selectedVideo.id
            ? { ...video, note: { id: video.note?.id || 0, content: noteInput } }
            : video
        ));
        setSelectedVideo({ ...selectedVideo, note: { id: selectedVideo.note?.id || 0, content: noteInput } });
      }
    } catch (error) {
      // handle error
    } finally {
      setNoteSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner/> 
  }

  // Progress calculation
  const completed = videos.filter(v => v.status === 'COMPLETE').length;
  const total = videos.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Description show more/less logic
  const getDescription = () => {
    if (!selectedVideo) return '';
    if (descExpanded) return selectedVideo.description;
    // Show only first 3 lines (approx)
    const lines = selectedVideo.description.split('\n');
    if (lines.length > MAX_DESCRIPTION_LINES) {
      return lines.slice(0, MAX_DESCRIPTION_LINES).join('\n');
    }
    // If not enough newlines, fallback to char limit
    if (selectedVideo.description.length > 220) {
      return selectedVideo.description.slice(0, 220) + '...';
    }
    return selectedVideo.description;
  };
  const shouldShowMore = selectedVideo && (
    selectedVideo.description.split('\n').length > MAX_DESCRIPTION_LINES || selectedVideo.description.length > 220
  );

  return (
    <div className="playlist-detail-container">
      <div className="playlist-header">
        <h1>{playlist?.title}</h1>
        <p className="channel-title">{playlist?.channelTitle}</p>
        <div className="playlist-progress-bar">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: percent + '%' }} />
          </div>
          <div className="progress-bar-label">
            {completed} of {total} completed ({percent}%)
          </div>
        </div>
      </div>
      <div className="playlist-content">
        {/* Sidebar toggle for mobile */}
        <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(v => !v)}>
          <span className="sidebar-toggle-icon">☰</span> Playlist
        </button>
        <aside className={`video-list${sidebarOpen ? ' open' : ''}`}>
          {videos.map((video) => (
            <div
              key={video.id}
              className={`video-item ${selectedVideo?.id === video.id ? 'selected' : ''}`}
              onClick={() => handleVideoSelect(video)}
            >
              <div className="video-thumbnail">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`}
                  alt={video.title}
                />
                <span className="video-position">{video.position}</span>
              </div>
              <div className="video-info">
                <h3 title={video.title}>{video.title}</h3>
                <div className="video-status">
                  <span className={`status-indicator ${video.status.toLowerCase()}`}>{video.status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          ))}
        </aside>
        <section className="video-player-section">
          {selectedVideo && (
            <>
              <div className="video-player">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeVideoId}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="video-details">
                <h2>{selectedVideo.title}</h2>
                <p className={`video-description${descExpanded ? ' expanded' : ''}`}>{getDescription()}</p>
                {shouldShowMore && (
                  <button className="show-more-btn" onClick={() => setDescExpanded(v => !v)}>
                    {descExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
                <div className="video-actions">
                  <button
                    className={`complete-btn ${selectedVideo.status === 'COMPLETE' ? 'completed' : ''}`}
                    onClick={() => handleToggleComplete(selectedVideo)}
                  >
                    {selectedVideo.status === 'COMPLETE' ? 'Mark as In Progress' : 'Mark as Completed'}
                  </button>
                </div>
                <div className="video-notes">
                  <h3>Notes</h3>
                  <textarea
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    rows={4}
                    className="note-input"
                    placeholder="Add your notes here..."
                  />
                  <button className="save-note-btn" onClick={handleNoteSave} disabled={noteSaving}>
                    {noteSaving ? 'Saving...' : 'Save Note'}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default PlaylistDetailPage; 