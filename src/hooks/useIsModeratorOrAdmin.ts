import { useAppSelector } from '../store';

const useIsModeratorOrAdmin = () => {
  const profile = useAppSelector(state => state.auth.profile);

  if (!profile) return false;

  return !!(
    profile.roles.includes('ADMIN') || profile.roles.includes('MODERATOR')
  );
};

export default useIsModeratorOrAdmin;
