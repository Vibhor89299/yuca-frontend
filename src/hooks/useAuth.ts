import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  isAdmin: boolean;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isAdmin, loading } = useAppSelector((state: RootState) => ({
    user: state.auth.user as User | null,
    token: state.auth.token as string | null,
    isAuthenticated: state.auth.isAuthenticated,
    isAdmin: state.auth.isAdmin,
    loading: state.auth.loading,
  }));

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    loading,
    logout,
  };
};

export default useAuth;
