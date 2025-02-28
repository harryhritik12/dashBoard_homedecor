// ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import  AuthContext from './AuthContext'; 

const ProtectedRoute = () => {
  const { isAuthenticated } = AuthContext();
 
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
