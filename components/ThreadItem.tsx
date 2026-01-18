import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Thread } from "../types/discuz";

interface ThreadItemProps {
    thread: Thread;
}

export function ThreadItem({ thread }: ThreadItemProps) {
    // Simple date formatting
    const formatDate = (timestamp: string) => {
        // timestamp might be "2023-1-1" or unix
        // Discuz mobile often returns formatted string or timestamp.
        // Let's assume string for now or check.
        return thread.dateline;
    };

    return (
        <Link href={`/threads/${thread.tid}`} asChild>
            <TouchableOpacity className="p-4 bg-white border-b border-gray-100 active:bg-gray-50">
                <Text className="text-base font-medium text-gray-900 leading-snug mb-1">
                    {thread.subject}
                </Text>

                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                        <Text className="text-xs text-gray-500 mr-2">{thread.author}</Text>
                        <Text className="text-xs text-gray-400">{thread.dateline}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Text className="text-xs text-gray-500 mr-2">Repl: {thread.replies}</Text>
                        <Text className="text-xs text-gray-400">View: {thread.views}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
}
