import React from "react";
import { useAppSelector } from "../app/hooks";
import { Navigate } from "react-router-dom";


const LandingPage: React.FC = () => {


    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);


    if(isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleGoogleLogin = () => {
        // Redirect to your OAuth provider's login page
        window.location.href = `http://localhost:8080/oauth2/authorization/google`;
    }

    return (
        <div>
            <h1>Welcome! Please Sign in</h1>
            <p>This is the beautiful landing page.</p>
            <button onClick={handleGoogleLogin}>Sign in with Google</button>
        </div>
    )

}

export default LandingPage;