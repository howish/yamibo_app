import { useEffect, useState } from "react";
import { View, Text, SectionList, ActivityIndicator, SafeAreaView, RefreshControl } from "react-native";
import { YamiboApi } from "../services/api";
import { Category, Forum, ForumIndexVariables } from "../types/discuz";
import { ForumItem } from "../components/ForumItem";
import { StatusBar } from "expo-status-bar";

interface Section {
    title: string;
    data: Forum[];
}

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState<Section[]>([]);
    const [refreshing, setRefreshing] = useState(false);

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

    const processForumData = (data: ForumIndexVariables): Section[] => {
        const { catlist, forumlist } = data;
        if (!catlist || !forumlist) return [];

        // Map forums by FID for easy lookup
        const forumMap: Record<string, Forum> = {};
        if (Array.isArray(forumlist)) {
            forumlist.forEach(f => forumMap[f.fid] = f);
        } else {
            // sometimes forumlist is an object in Discuz API
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
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.fid}
                renderItem={({ item }) => <ForumItem forum={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <View className="bg-gray-100 px-4 py-2 border-y border-gray-200">
                        <Text className="text-sm font-bold text-gray-500 uppercase">{title}</Text>
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
