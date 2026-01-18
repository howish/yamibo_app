import { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { YamiboApi } from "../../services/api";
import { Post, Thread } from "../../types/discuz";
import { PostItem } from "../../components/PostItem";

export default function ThreadView() {
    const { tid } = useLocalSearchParams<{ tid: string }>();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [threadInfo, setThreadInfo] = useState<Thread | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPosts = async (pageNum: number, refresh: boolean = false) => {
        if (!tid) return;
        try {
            setLoading(true);
            const data = await YamiboApi.getPostList(tid, pageNum);

            setThreadInfo(data.thread);

            const newPosts = data.postlist || [];

            if (refresh) {
                setPosts(newPosts);
            } else {
                setPosts(prev => {
                    const existingIds = new Set(prev.map(p => p.pid));
                    const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.pid));
                    return [...prev, ...uniqueNewPosts];
                });
            }

            if (newPosts.length === 0) {
                setHasMore(false);
            }

        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts(1, true);
    }, [tid]);

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        fetchPosts(1, true);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{ title: threadInfo?.subject || "Thread" }} />
            {loading && page === 1 ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#ec4899" />
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.pid}
                    renderItem={({ item }) => <PostItem post={item} />}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={hasMore && page > 1 ? <ActivityIndicator className="py-4" color="#ec4899" /> : null}
                />
            )}
        </View>
    );
}
