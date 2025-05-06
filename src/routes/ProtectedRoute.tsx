import React from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import LoadingSpinner from '../components/LoadingSpinner';


const ProtectedRoute: React.FC = () => {
    const {isAuthenticated, isLoading} = useAppSelector((state) => state.auth);
    const location = useLocation();

    if(isLoading) {
        return <LoadingSpinner />;
    }
    if (!isAuthenticated) {
      // Redirect them to the / page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.

      return <Navigate to="/" state={{ from: location }} replace />;
    }


    return <Outlet />; // Render child routes

    
}


export default ProtectedRoute;