import React from "react";
import { BrowserRouter , Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import DashboardPage from "../pages/DashboardPage";
import DashboardPlaylists from "../pages/DashboardPlaylists";
import DashboardAddPlaylist from "../pages/DashboardAddPlaylist";
import OAuthFallbackPage from "../pages/OAuthFallbackPage";
import ProtectedRoute from "./ProtectedRoute";
import AuthProvider from "../features/auth/AuthProvider";
import NotFoundPage from "../pages/NotFoundPage";


const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
         {/*AuthProvider checkes auth statsu on initial load  */} 
         <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/oauth-fallback" element={<OAuthFallbackPage />} />
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />}>
                        <Route index element={<DashboardPlaylists />} />
                        <Route path="playlists" element={<DashboardPlaylists />} />
                        <Route path="add" element={<DashboardAddPlaylist />} />
                    </Route>
                    {/* Add more protected routes here */}
                </Route>

                {/* You can also add a 404 page here */}
                 <Route path="*" element={<NotFoundPage />} /> 
            </Routes>
         </AuthProvider>
        </BrowserRouter>
    )
}


export default AppRoutes;