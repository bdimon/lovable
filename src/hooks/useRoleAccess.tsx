
import { useAuth } from './useAuth';
import { UserRole } from '@/types/auth';

export const useRoleAccess = () => {
  const { hasRole, profile } = useAuth();

  const canAccess = (requiredRoles: UserRole | UserRole[]) => {
    return hasRole(requiredRoles);
  };

  const isAdmin = () => hasRole('admin');
  const isModerator = () => hasRole(['admin', 'moderator']);
  const isUser = () => hasRole('user');

  return {
    canAccess,
    isAdmin,
    isModerator,
    isUser,
    currentRole: profile?.role
  };
};
