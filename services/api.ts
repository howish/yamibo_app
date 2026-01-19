import axios from 'axios';
import {
    DiscuzResponse,
    ForumIndexVariables,
    ForumDisplayVariables,
    ViewThreadVariables
} from '../types/discuz';

import { Platform } from 'react-native';

const BASE_URL = 'https://bbs.yamibo.com/api/mobile/index.php';

// Use a CORS proxy for web functionality
// Use a local proxy server (CORS fixed) on port 3002
// The proxy forwards everything to https://bbs.yamibo.com and fixes headers
const baseURL = Platform.OS === 'web' ? 'http://localhost:3002/api/mobile/index.php' : BASE_URL;

const api = axios.create({
    baseURL: baseURL,
    params: {
        version: 4,
    },
});

import { Storage } from '../utils/storage';

const AUTH_KEY = 'yamibo_auth_token';

// Request interceptor to add auth token
// Add a variable to hold the cookie in memory updates
let globalCookie = '';

export const setGlobalCookie = (cookie: string) => {
    globalCookie = cookie;
};

export const clearGlobalCookie = () => {
    globalCookie = '';
};

// Request interceptor to add auth token and cookie
api.interceptors.request.use(
    async (config) => {
        // Add User-Agent to avoid 403 checks sometimes
        config.headers['User-Agent'] = 'YamiboApp/1.0';

        const token = await Storage.getItem(AUTH_KEY);
        if (token) {
            if (!config.params) config.params = {};
            config.params.auth = token;
        }

        // Add Cookie if available (critical for Hybrid Auth)
        const storedCookie = await Storage.getItem('yamibo_cookie');
        if (storedCookie || globalCookie) {
            config.headers['Cookie'] = globalCookie || storedCookie;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle Discuz API structure
api.interceptors.response.use(
    (response) => {
        // Discuz sometimes returns data in a weird format or with mixed types
        // We can add more robust error handling here if needed
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const YamiboApi = {
    getForumIndex: async () => {
        const response = await api.get<DiscuzResponse<ForumIndexVariables>>('', {
            params: {
                module: 'forumindex',
            },
        });
        return response.data.Variables;
    },

    getThreadList: async (fid: string, page: number = 1) => {
        const response = await api.get<DiscuzResponse<ForumDisplayVariables>>('', {
            params: {
                module: 'forumdisplay',
                fid,
                page,
                tpp: 20, // Threads per page
            },
        });
        return response.data.Variables;
    },

    getPostList: async (tid: string, page: number = 1) => {
        const response = await api.get<DiscuzResponse<ViewThreadVariables>>('', {
            params: {
                module: 'viewthread',
                tid,
                page,
                ppp: 20, // Posts per page
            },
        });
        return response.data.Variables;
    },

    // Get current user info from session
    getMe: async () => {
        // 'module=login' with no arguments often returns the current user state variables
        const response = await api.get<DiscuzResponse<import('../types/discuz').LoginVariables>>('', {
            params: {
                module: 'login',
                version: 4
            }
        });
        return response.data;
    },

    // Placeholder for login
    login: async (username: string, password: string) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        // Standard Discuz login usually requires 'questionid', 'answer', 'cookietime' etc.
        // For mobile API, basic fields might suffice.
        // Usually, the endpoint is module=login&loginsubmit=yes

        const response = await api.post<DiscuzResponse<import('../types/discuz').LoginVariables>>('', formData, {
            params: {
                module: 'login',
                loginsubmit: 'yes',
                loginfield: 'username',
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data.Variables;
    },

    clearCookies: () => {
        clearGlobalCookie();
    }
};
