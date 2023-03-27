import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthCtx } from './store/authProvider';
import Finance from './Finance';
import Login from './components/pages/login';
import Register from './components/pages/register';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  const { isUserLoggedIn: isAuthenticated } = useAuthCtx();

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Finance />
              </ProtectedRoute>
            }
          />
          {!isAuthenticated && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      )}
    </>
  );
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isUserLoggedIn: isAuthenticated } = useAuthCtx();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
