import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import SidebarLayout from './SidebarLayout';

const PrivateRoute = () => {
  const token = useSelector((state: RootState) => state.admin.token); 
  const user = useSelector((state: RootState) => state.admin.user); 

    const isRehydrated = useSelector(
      (state: RootState) => state._persist?.rehydrated
    );

    if (!isRehydrated) {
      // Optionally show a loading state while waiting for rehydration
      return <div>Loading...</div>;
    }
  console.log("🚀 ~ PrivateRoute ~ token:", token)
  console.log('🚀 ~ PrivateRoute ~ user:', user);

  return token ? <SidebarLayout /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
