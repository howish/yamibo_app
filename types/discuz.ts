export interface DiscuzResponse<T> {
    Version: string;
    Charset: string;
    Variables: T;
    Message?: {
        messageval: string;
        messagestr: string;
    };
}

export interface ForumIndexVariables {
    member_uid: string;
    member_username: string;
    formhash: string;
    catlist: Category[];
    forumlist: Forum[];
}

export interface Category {
    fid: string;
    name: string;
    forums: string[];
}

export interface Forum {
    fid: string;
    name: string;
    threads: string;
    posts: string;
    todayposts: string;
    description: string;
    icon: string;
    sublist?: Forum[];
}

export interface ForumDisplayVariables {
    forum: Forum;
    forum_threadlist: Thread[];
    sublist?: Forum[]; // Sub-forums
}

export interface Thread {
    tid: string;
    author: string;
    authorid: string;
    subject: string;
    dateline: string;
    lastpost: string;
    lastposter: string;
    views: string;
    replies: string;
    readperm: string;
    digest: string;
    attachment: string; // '0', '1', '2' etc
}

export interface ViewThreadVariables {
    thread: Thread;
    postlist: Post[];
}

export interface Post {
    pid: string;
    tid: string;
    first: string; // '1' if it's the thread starter (topic), '0' if reply
    author: string;
    authorid: string;
    dateline: string;
    message: string; // The HTML/BBCode content
    anonymous: string;
    attachment: string;
    attachments?: Record<string, Attachment>;
}

export interface Attachment {
    aid: string;
    url: string;
    attachment: string; // Relative path
}

export interface LoginVariables {
    auth: string | null;
    saltkey: string;
    member_uid: string;
    member_username: string;
    member_avatar: string;
    groupid: string;
    formhash: string;
}
