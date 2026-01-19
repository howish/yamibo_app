import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Forum } from "../types/discuz";

interface ForumItemProps {
    forum: Forum;
}

export function ForumItem({ forum }: ForumItemProps) {
    return (
        <Link href={`/forums/${forum.fid}`} asChild>
            <TouchableOpacity className="flex-row items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700">
                {forum.icon ? (
                    <Image
                        source={{ uri: forum.icon }}
                        className="w-10 h-10 mr-3 rounded-lg"
                        contentFit="cover"
                    />
                ) : (
                    <View className="w-10 h-10 mr-3 rounded-lg bg-pink-100 dark:bg-pink-900 items-center justify-center">
                        <Text className="text-pink-500 dark:text-pink-300 font-bold text-lg">{forum.name[0]}</Text>
                    </View>
                )}
                <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800 dark:text-gray-100">{forum.name}</Text>
                    {forum.description ? (
                        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" numberOfLines={1}>
                            {forum.description}
                        </Text>
                    ) : null}
                </View>
                <View className="items-end">
                    <Text className="text-xs text-gray-400 dark:text-gray-500">{forum.todayposts && forum.todayposts !== "0" ? `Today: ${forum.todayposts}` : ""}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
}
