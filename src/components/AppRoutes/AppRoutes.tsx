import { Route, Routes } from 'react-router';

import LoginPage from '../../pages/LoginPage';
import ProfilePage from '../../pages/ProfilePage';
import RegisterPage from '../../pages/RegisterPage';
import TodoPage from '../../pages/TodoPage';
import UserPage from '../../pages/UserPage';
import UsersPage from '../../pages/UsersPage';
import PrivateRoute from '../Route/PrivateRoute';
import ProtectedRoute from '../Route/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path={'/'} element={<TodoPage />} />
        <Route path={'/profile'} element={<ProfilePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path={'/users'} element={<UsersPage />} />
          <Route path={'/user/:id'} element={<UserPage />} />
        </Route>
      </Route>
      <Route path={'/login'} element={<LoginPage />} />
      <Route path={'/register'} element={<RegisterPage />} />
    </Routes>
  );
};

export default AppRoutes;
