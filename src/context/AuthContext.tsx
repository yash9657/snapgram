import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const INITIAL_USER = {
    id: '',
    email: '',
    name: '',
    imageUrl: '',
    username: '',
    bio: '',
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isAuthenticated: false,
    isLoading: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

const AuthProvider = ({ children }: { children: React.ReactNode}) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('cookieFallback') === '[]') {
            navigate('/sign-in');
        }

        checkAuthUser();
    }, []);

  const checkAuthUser = async () => {
    console.log('inside checkAuthUser');
    try {
        const currentAccount = await getCurrentUser();

        if(currentAccount) {
            setUser({
                id: currentAccount.$id,
                email: currentAccount.email,
                name: currentAccount.name,
                imageUrl: currentAccount.imageUrl,
                username: currentAccount.username,
                bio: currentAccount.bio,
            });

            setIsAuthenticated(true);

            return true;
        }

        return false;
    } catch (error) {
        console.log(error);
        return false;
    } finally {
        setIsLoading(false);
    }
  }
  
  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    checkAuthUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext)