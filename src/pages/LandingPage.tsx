import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import '../styles/LandingPage.css';
import landing_page_2 from '../assets/photo_banner_1.jpg';
const LandingPage: React.FC = () => {
    const {isAuthenticated} = useAppSelector(state => state.auth);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isHovering && bannerRef.current) {
                const rect = bannerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate rotation based on mouse position
                const rotateX = (y / rect.height - 0.5) * -3;
                const rotateY = (x / rect.width - 0.5) * 3;
                
                bannerRef.current.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateZ(10px)
                `;
                
                setCursorPosition({ x: e.clientX, y: e.clientY });
            }
        };

        const handleMouseLeave = () => {
            if (bannerRef.current) {
                bannerRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            }
            setIsHovering(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isHovering]);

    if(isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleGoogleLogin = () => {
        // Redirect to your OAuth provider's login page
        window.location.href = `http://localhost:8080/oauth2/authorization/google`;
    }

    return (
        <div className="landing-container">
            <div 
                className="cursor-effect" 
                style={{ 
                    left: `${cursorPosition.x}px`, 
                    top: `${cursorPosition.y}px`,
                    transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`
                }}
            />
            
            <section className="hero-section">
                <h1 className="hero-title">YTLearn</h1>
                <p className="hero-subtitle">
                    Transform YouTube playlists into an interactive learning experience. 
                    Track progress, take notes, and master your favorite content.
                </p>
                <button className="google-login-btn" onClick={handleGoogleLogin}>
                    <img 
                        src="https://www.google.com/favicon.ico" 
                        alt="Google logo" 
                    />
                    Continue with Google
                </button>
            </section>

            <section className="banner-section">
                <div 
                    ref={bannerRef}
                    className="banner-container"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <img 
                        src={landing_page_2} 
                        alt="YTLearn Demo" 
                        className="banner-image"
                    />
                    <div className="banner-overlay">
                        <div className="banner-content">
                            <h2 className="banner-title">Experience Learning Like Never Before</h2>
                            <p className="banner-description">
                                Transform any YouTube playlist into an interactive learning platform. 
                                Track your progress, take notes, and master your favorite content with ease.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3 className="feature-title">Track Progress</h3>
                    <p className="feature-description">
                        Monitor your learning journey with detailed progress tracking for each video in your playlist.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">📝</div>
                    <h3 className="feature-title">Take Notes</h3>
                    <p className="feature-description">
                        Capture your thoughts and key points with our integrated note-taking system.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3 className="feature-title">Organise Your Learning</h3>
                    <p className="feature-description">
                        Organise your learning by creating custom playlists and categorising videos.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;