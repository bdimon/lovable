
import { ReactNode } from 'react';
import AuthGuard from './AuthGuard';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole | UserRole[];
  fallbackUrl?: string;
}

const ProtectedRoute = ({ children, roles, fallbackUrl }: ProtectedRouteProps) => {
  return (
    <AuthGuard requiredRoles={roles} fallbackUrl={fallbackUrl}>
      {children}
    </AuthGuard>
  );
};

export default ProtectedRoute;
