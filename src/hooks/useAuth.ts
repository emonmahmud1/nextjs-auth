import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Custom hook to protect pages
 * Redirects to login if user is not authenticated
 * 
 * @example
 * function ProtectedPage() {
 *   useRequireAuth();
 *   
 *   return <div>Protected content</div>;
 * }
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}

/**
 * Custom hook to redirect if already authenticated
 * Useful for login/register pages
 * 
 * @example
 * function LoginPage() {
 *   useRedirectIfAuthenticated();
 *   
 *   return <div>Login form</div>;
 * }
 */
export function useRedirectIfAuthenticated(redirectTo: string = '/') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}

/**
 * Custom hook to get user information
 * Returns null if not authenticated
 * 
 * @example
 * function Profile() {
 *   const user = useUser();
 *   
 *   if (!user) return <div>Please login</div>;
 *   
 *   return <div>Welcome {user.name}</div>;
 * }
 */
export function useUser() {
  const { user } = useAuth();
  return user;
}
