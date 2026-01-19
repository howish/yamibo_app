import { Storage } from '../utils/storage';
import { YamiboApi } from './api';

const AUTH_KEY = 'yamibo_auth_token';
const USER_KEY = 'yamibo_user_info';

export interface UserSession {
    uid: string;
    username: string;
    avatar: string;
    groupId: string;
}

export const AuthService = {
    // Attempt to log in with username and password
    login: async (username: string, password: string): Promise<UserSession> => {
        try {
            const data = await YamiboApi.login(username, password);

            if (!data.member_uid || data.member_uid === '0') {
                throw new Error("Login failed: Invalid credentials or server error");
            }

            const session: UserSession = {
                uid: data.member_uid,
                username: data.member_username,
                avatar: data.member_avatar,
                groupId: data.groupid,
            };

            // Calculate 'auth' token if returned, or store cookie manually if we had full cookie jar support
            // For now, if 'auth' variable is returned by module=login (it usually is), store it.
            if (data.auth) {
                await Storage.setItem(AUTH_KEY, data.auth);
            }

            await Storage.setItem(USER_KEY, JSON.stringify(session));
            return session;

        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    // ... existing login method

    // Log in with a cookie string extracted from WebView
    loginWithCookies: async (cookieString: string): Promise<UserSession> => {
        try {
            // Save cookie
            await Storage.setItem('yamibo_cookie', cookieString);

            // Validate session and get user info
            // API often returns user info in the Variables object of many calls. 
            // 'module=login' is a safe read-only one.
            const data = await YamiboApi.getMe();

            if (!data.Variables || !data.Variables.member_uid || data.Variables.member_uid === '0') {
                // Try extracting from cookie if API fails (fallback)
                // But usually API should return it.
                throw new Error("Cookie invalid or session expired");
            }

            const session: UserSession = {
                uid: data.Variables.member_uid,
                username: data.Variables.member_username,
                avatar: data.Variables.member_avatar,
                groupId: data.Variables.groupid,
            };

            await Storage.setItem(USER_KEY, JSON.stringify(session));
            return session;

        } catch (error) {
            console.error("Cookie login error:", error);
            await Storage.deleteItem('yamibo_cookie'); // Clear invalid cookie
            throw error;
        }
    },

    // Log out: clear storage
    logout: async () => {
        await Storage.deleteItem(AUTH_KEY);
        await Storage.deleteItem(USER_KEY);
        await Storage.deleteItem('yamibo_cookie');
        YamiboApi.clearCookies();
    },

    // ... existing methods
    getSession: async (): Promise<UserSession | null> => {
        const userJson = await Storage.getItem(USER_KEY);
        if (userJson) {
            return JSON.parse(userJson) as UserSession;
        }
        return null;
    },

    // Get raw auth token for API calls
    getAuthToken: async (): Promise<string | null> => {
        return await Storage.getItem(AUTH_KEY);
    }
};
