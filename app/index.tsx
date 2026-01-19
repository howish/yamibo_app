import { useEffect, useState } from "react";
import { View, Text, SectionList, ActivityIndicator, SafeAreaView, RefreshControl, TouchableOpacity } from "react-native";
import { YamiboApi } from "../services/api";
import { Category, Forum, ForumIndexVariables } from "../types/discuz";
import { ForumItem } from "../components/ForumItem";
import { StatusBar } from "expo-status-bar";
import { Link, Stack } from "expo-router";

interface Section {
    title: string;
    data: Forum[];
}

import { useAuth } from "../context/AuthContext";
import { Image } from "expo-image";

import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";

export default function Index() {
    const { user, logout } = useAuth();
    console.log("Index Screen: Current user state:", user);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState<Section[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    // Update header when user state changes
    // Update header dynamically
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Link href="/settings" asChild>
                    <TouchableOpacity className="p-2">
                        <Text className="text-gray-900 dark:text-white text-lg">⚙️</Text>
                    </TouchableOpacity>
                </Link>
            ),
            headerRight: () => (
                user ? (
                    <View className="flex-row items-center gap-2">
                        <Text className="text-sm text-gray-700 dark:text-gray-300">{user.username}</Text>
                        <TouchableOpacity onPress={logout} className="p-2">
                            <Text className="text-pink-500 font-bold">Logout</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Link href="/login" asChild>
                        <TouchableOpacity className="p-2">
                            <Text className="text-pink-500 font-bold">Login</Text>
                        </TouchableOpacity>
                    </Link>
                )
            ),
        });
    }, [navigation, user, logout]);

    const fetchData = async () => {
        try {
            const data = await YamiboApi.getForumIndex();
            const processedSections = processForumData(data);
            setSections(processedSections);
        } catch (error) {
            console.error("Failed to fetch forum index", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ... existing processForumData ...
    const processForumData = (data: ForumIndexVariables): Section[] => {
        const { catlist, forumlist } = data;
        if (!catlist || !forumlist) return [];

        const forumMap: Record<string, Forum> = {};
        if (Array.isArray(forumlist)) {
            forumlist.forEach(f => forumMap[f.fid] = f);
        } else {
            Object.values(forumlist).forEach((f: any) => forumMap[f.fid] = f);
        }

        return catlist.map((cat: Category) => {
            const categoryForums = cat.forums.map((fid) => forumMap[fid]).filter(Boolean);
            return {
                title: cat.name,
                data: categoryForums,
            };
        });
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#ec4899" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black">
            <StatusBar style="auto" />
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.fid}
                renderItem={({ item }) => <ForumItem forum={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <View className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-y border-gray-200 dark:border-gray-700">
                        <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">{title}</Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ec4899" />
                }
                stickySectionHeadersEnabled={true}
            />
        </SafeAreaView>
    );
}
