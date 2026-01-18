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
            <TouchableOpacity className="flex-row items-center p-4 bg-white border-b border-gray-100 active:bg-gray-50">
                {forum.icon ? (
                    <Image
                        source={{ uri: forum.icon }}
                        className="w-10 h-10 mr-3 rounded-lg"
                        contentFit="cover"
                    />
                ) : (
                    <View className="w-10 h-10 mr-3 rounded-lg bg-pink-100 items-center justify-center">
                        <Text className="text-pink-500 font-bold text-lg">{forum.name[0]}</Text>
                    </View>
                )}
                <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">{forum.name}</Text>
                    {forum.description ? (
                        <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
                            {forum.description}
                        </Text>
                    ) : null}
                </View>
                <View className="items-end">
                    <Text className="text-xs text-gray-400">{forum.todayposts && forum.todayposts !== "0" ? `Today: ${forum.todayposts}` : ""}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
}
