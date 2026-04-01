import { Navigate, Outlet } from 'react-router';

import { useAppSelector } from '../../store';

const PrivateRoute = () => {
  const isAuth = useAppSelector(state => state.auth.isAuth);

  return isAuth ? <Outlet /> : <Navigate to={'/login'} />;
};

export default PrivateRoute;
