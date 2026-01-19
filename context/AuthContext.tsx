import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService, UserSession } from '../services/auth';

interface AuthContextType {
    user: UserSession | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    loginWithWeb: (cookieString: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load session on startup
        loadSession();
    }, []);

    const loadSession = async () => {
        try {
            const session = await AuthService.getSession();
            setUser(session);
        } catch (error) {
            console.error("Failed to load session", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        console.log("AuthContext: Attempting login for", username);
        const session = await AuthService.login(username, password);
        console.log("AuthContext: Login successful, setting user", session);
        setUser(session);
    };

    const loginWithWeb = async (cookieString: string) => {
        console.log("AuthContext: Logging in with cookies");
        try {
            const session = await AuthService.loginWithCookies(cookieString);
            setUser(session);
            return true;
        } catch (error) {
            console.error("Cookie login failed", error);
            return false;
        }
    };

    const logout = async () => {
        console.log("AuthContext: Logging out");
        await AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, loginWithWeb, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
