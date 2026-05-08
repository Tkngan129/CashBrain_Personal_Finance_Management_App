import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();

  // Wait for auth check to complete - the navigation is handled by _layout.tsx
  // based on isLoggedIn state, so we don't need to render anything here
  return null;
}
