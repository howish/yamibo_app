import { useState, useEffect } from "react";
import { View, Text, useWindowDimensions, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Post } from "../types/discuz";
import RenderHtml, { HTMLContentModel, HTMLElementModel } from "react-native-render-html";
import ImageViewing from "react-native-image-viewing";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useColorScheme } from "nativewind";

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
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [visible, setVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState<string[]>([]);

    // Extract images when post changes
    useEffect(() => {
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        const matches = [];
        let match;
        // Reset lastIndex just in case
        imgRegex.lastIndex = 0;

        // Simple extraction for now.
        // In a perfect world we traverse the TDOM, but regex is fast and usually 'good enough' for generic content
        while ((match = imgRegex.exec(post.message)) !== null) {
            const src = match[1];
            // Filter out smileys
            if (!src.includes('smiley') && !src.includes('static/image/common') && !src.includes('magic')) {
                matches.push(src);
            }
        }
        setImages(matches);
    }, [post.message]);

    // Function to download image
    const handleDownload = async (uri: string) => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant permission to save images.');
                return;
            }

            if (!FileSystem.documentDirectory) {
                Alert.alert('Error', 'Device storage not available.');
                return;
            }

            const filename = uri.split('/').pop() || 'image.jpg';
            const fileUri = FileSystem.documentDirectory + filename;

            const { uri: localUri } = await FileSystem.downloadAsync(uri, fileUri);
            await MediaLibrary.saveToLibraryAsync(localUri);
            Alert.alert('Saved', 'Image saved to gallery!');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save image.');
        }
    };

    // Custom Image Renderer
    const renderers = {
        img: (payload: any) => {
            const { tnode } = payload;
            const uri = tnode.attributes.src;

            // Replicate filtering logic to decide if it is a gallery image
            const isGalleryImage = !uri.includes('smiley') && !uri.includes('static/image/common') && !uri.includes('magic');

            if (!isGalleryImage) {
                // Render small smileys normally (inline)
                return (
                    <Image
                        source={{ uri }}
                        style={{ width: 24, height: 24 }}
                        contentFit="contain"
                        key={uri}
                    />
                );
            }

            return (
                <TouchableOpacity
                    onPress={() => {
                        const index = images.indexOf(uri);
                        if (index !== -1) {
                            setCurrentImageIndex(index);
                            setVisible(true);
                        } else {
                            // Should not happen if regex matches, but fall back safely
                            setImages([uri]);
                            setCurrentImageIndex(0);
                            setVisible(true);
                        }
                    }}
                    key={uri}
                    activeOpacity={0.9}
                >
                    <Image
                        source={{ uri }}
                        style={{ width: width - 40, height: Math.min(width, 300), marginBottom: 8, borderRadius: 8, backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
                        contentFit="contain"
                    />
                </TouchableOpacity>
            )
        }
    }

    return (
        <View className="p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 mb-2">
            <View className="flex-row justify-between mb-2">
                <Text className="font-bold text-gray-800 dark:text-gray-200">{post.author}</Text>
                <Text className="text-xs text-gray-400 dark:text-gray-500">{post.dateline}</Text>
            </View>

            {/* Render HTML content safely */}
            <RenderHtml
                contentWidth={width - 32}
                source={{ html: post.message }}
                baseStyle={{
                    fontSize: 16,
                    color: isDark ? "#e5e7eb" : "#1f2937",
                    lineHeight: 24
                }}
                tagsStyles={{
                    img: { maxWidth: "100%", height: "auto" },
                    p: { marginBottom: 8 },
                    a: { color: "#ec4899", textDecorationLine: 'none' }
                }}
                customHTMLElementModels={customHTMLElementModels}
                renderers={renderers}
            />

            {post.attachment === "1" || post.attachment === "2" ? (
                <View className="mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <Text className="text-xs text-gray-500 dark:text-gray-400">Has Attachments</Text>
                </View>
            ) : null}

            <ImageViewing
                images={images.map(uri => ({ uri }))}
                imageIndex={currentImageIndex}
                visible={visible}
                onRequestClose={() => setVisible(false)}
                FooterComponent={({ imageIndex }) => (
                    <View className="flex-row justify-center pb-10">
                        <TouchableOpacity
                            className="bg-black/50 p-3 rounded-full"
                            onPress={() => handleDownload(images[imageIndex])}
                        >
                            <Text className="text-white font-bold">Save Image</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}
