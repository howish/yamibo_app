import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'howish';
const REPO_NAME = 'yamibo_app';

export interface GitHubIssue {
    title: string;
    body: string;
}

export const GitHubService = {
    submitIssue: async (issue: GitHubIssue, pat: string) => {
        try {
            const response = await axios.post(
                `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
                issue,
                {
                    headers: {
                        Authorization: `Bearer ${pat}`,
                        Accept: 'application/vnd.github+json',
                        'X-GitHub-Api-Version': '2022-11-28',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('GitHub API Error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to submit issue to GitHub');
        }
    }
};
