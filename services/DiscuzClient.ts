import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ForumIndexResponse, ThreadListResponse, PostListResponse } from "../types/discuz";

const BASE_URL = "https://bbs.yamibo.com/api/mobile/index.php";

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        version: 4,
    },
});

// Interceptor to add auth token/cookie if needed
api.interceptors.request.use(async (config) => {
    // Discuz usually uses cookies or a specific auth param.
    // For mobile API, sometimes it's just cookie based or `formhash` + `auth` param.
    // We'll implemented cookie persistence later if needed, or simple token storage.
    // For now, let's assume standard handling.
    return config;
});

export const DiscuzClient = {
    fetchForumIndex: async (): Promise<ForumIndexResponse> => {
        const response = await api.get("", {
            params: {
                module: "forumindex",
            },
        });
        return response.data;
    },

    fetchThreads: async (fid: string, page: number = 1): Promise<ThreadListResponse> => {
        const response = await api.get("", {
            params: {
                module: "forumdisplay",
                fid,
                page,
                tpp: 20, // Threads per page
            },
        });
        return response.data;
    },

    fetchPosts: async (tid: string, page: number = 1): Promise<PostListResponse> => {
        const response = await api.get("", {
            params: {
                module: "viewthread",
                tid,
                page,
                ppp: 15, // Posts per page
            },
        });
        return response.data;
    },

    // Login placeholder
    login: async (username: string, password: string) => {
        // TODO: Implement login logic
        // Usually involves `module=login&action=login`
    }
};
