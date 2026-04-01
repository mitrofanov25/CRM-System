import { Navigate, Outlet } from 'react-router';

import useIsModeratorOrAdmin from '../../hooks/useIsModeratorOrAdmin';

const ProtectedRoute = () => {
  if (useIsModeratorOrAdmin()) {
    return <Outlet />;
  }

  return <Navigate to={'/'} />;
};

export default ProtectedRoute;
