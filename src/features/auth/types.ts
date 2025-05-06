export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
    profilePicture: string;
  } | null;
  isLoading: boolean; // for initial auth check and refresh
  error: string | null;
}
