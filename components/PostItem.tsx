import { View, Text, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { Post } from "../types/discuz";
import RenderHtml, { HTMLContentModel, HTMLElementModel } from "react-native-render-html";

const customHTMLElementModels = {
    font: HTMLElementModel.fromCustomModel({
        tagName: 'font',
        contentModel: HTMLContentModel.textual,
    })
};

interface PostItemProps {
    post: Post;
}

export function PostItem({ post }: PostItemProps) {
    const { width } = useWindowDimensions();

    return (
        <View className="p-4 bg-white border-b border-gray-100 mb-2">
            <View className="flex-row justify-between mb-2">
                <Text className="font-bold text-gray-800">{post.author}</Text>
                <Text className="text-xs text-gray-400">{post.dateline}</Text>
            </View>

            {/* Render HTML content safely */}
            <RenderHtml
                contentWidth={width - 32}
                source={{ html: post.message }}
                baseStyle={{ fontSize: 16, color: "#1f2937", lineHeight: 24 }}
                tagsStyles={{
                    img: { maxWidth: "100%", height: "auto" },
                    p: { marginBottom: 8 }
                }}
                customHTMLElementModels={customHTMLElementModels}
            />

            {post.attachment === "1" || post.attachment === "2" ? (
                <View className="mt-2 bg-gray-50 p-2 rounded">
                    <Text className="text-xs text-gray-500">Has Attachments</Text>
                </View>
            ) : null}
        </View>
    );
}
