import React, {useEffect} from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { checkAuthStatus } from "./authSlice";
import LoadingSpinner from "../../components/LoadingSpinner";


interface AuthProviderProps {
    children: React.ReactNode;
}


// This component wraps the routes and triggers the initial auth check

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.auth);

    useEffect(() => {
      // Only check auth status if it hasn't been checked yet (isLoading is true initially)
      // Or if you want to re-verify periodically, add logic here.
      if(isLoading) {

        dispatch(checkAuthStatus());
      }
    }, [dispatch, isLoading]);

    if (isLoading) {
        return <LoadingSpinner/>// You can replace this with a loading spinner or skeleton
    }

    return <>{children}</>; // Render the children (routes)

}


export default AuthProvider;