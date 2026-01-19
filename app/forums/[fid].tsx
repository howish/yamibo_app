import { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { YamiboApi } from "../../services/api";
import { Thread } from "../../types/discuz";
import { ThreadItem } from "../../components/ThreadItem";

export default function ForumDisplay() {
    const { fid } = useLocalSearchParams<{ fid: string }>();
    const [loading, setLoading] = useState(true);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [forumName, setForumName] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchThreads = async (pageNum: number, refresh: boolean = false) => {
        if (!fid) return;
        try {
            if (pageNum === 1) setLoading(true);
            const data = await YamiboApi.getThreadList(fid, pageNum);

            setForumName(data.forum.name);

            const newThreads = data.forum_threadlist || [];

            if (refresh) {
                setThreads(newThreads);
            } else {
                setThreads(prev => [...prev, ...newThreads]);
            }

            // Check if we reached the end (simple heuristic: empty list or small page)
            // Discuz usually doesn't return total pages clearly in mobile API variables easily without calculating from 'forum.threads' count.
            // But checking if newThreads is empty is a good stop.
            if (newThreads.length === 0) {
                setHasMore(false);
            }

        } catch (error) {
            console.error("Failed to fetch threads", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchThreads(1, true);
    }, [fid]);

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        fetchThreads(1, true);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchThreads(nextPage);
        }
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-black">
            <Stack.Screen options={{ title: forumName || "Forum" }} />
            {loading && page === 1 ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#ec4899" />
                </View>
            ) : (
                <FlatList
                    data={threads}
                    keyExtractor={(item) => item.tid}
                    renderItem={({ item }) => <ThreadItem thread={item} />}
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
