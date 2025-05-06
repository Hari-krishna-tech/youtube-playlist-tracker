import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom"; 
import { useAppDispatch } from "../app/hooks";
import { checkAuthStatus } from "../features/auth/authSlice";
import LoadingSpinner from "../components/LoadingSpinner";


const OAuthFallbackPage: React.FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(()=> {
        // When this page loads, the backend should have already set the cookies.
        // We trigger checkAuthStatus which attempts to fetch /api/users/me.
        // if successful, it will update the auth state in the redux store.

        console.log("OAuthFallbackPage: Dispatching checkAuthStatus...")
        dispatch(checkAuthStatus())
            .unwrap() // unwrap allows catching success/failure here
            .then(() => {
                console.log("OAuthFallbackPage: Auth check successful, navigating to dashboard...");
                navigate("/dashboard", {replace: true}); // Redirect to dashboard on success
            })
            .catch((error) => {
                console.error("OAuthFallbackPage: Auth check failed:", error);
                // Handle error if needed, e.g., show a message or redirect to login
                navigate("/", {replace: true}); // Redirect to login on failure
            });

    }, [dispatch, navigate]);


    return <LoadingSpinner />; // Show a loading spinner while checking auth status

}


export default OAuthFallbackPage;