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
const PROXY_URL = 'https://api.allorigins.win/raw?url=';
const baseURL = Platform.OS === 'web' ? `${PROXY_URL}${encodeURIComponent(BASE_URL)}` : BASE_URL;

const api = axios.create({
    baseURL: baseURL,
    params: {
        version: 4,
    },
});

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

    // Placeholder for login
    login: async () => {
        // TODO: Implement login
        throw new Error("Not implemented");
    }
};
