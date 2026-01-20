import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const { theme, setTheme, fontSize, setFontSize } = useTheme();
    const router = useRouter();

    const themeOptions = [
        { label: 'System Default', value: 'system' },
        { label: 'Light Mode', value: 'light' },
        { label: 'Dark Mode', value: 'dark' },
    ];

    const sizeOptions = [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Extra Large', value: 'xlarge' },
    ];

    return (
        <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
            <View className="p-6">
                <Text className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Appearance</Text>

                <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-8">
                    {themeOptions.map((option, index) => (
                        <TouchableOpacity
                            key={option.value}
                            className={`p-4 flex-row justify-between items-center ${index !== themeOptions.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                                }`}
                            onPress={() => setTheme(option.value as any)}
                        >
                            <Text className="text-base text-gray-800 dark:text-gray-200">{option.label}</Text>
                            {theme === option.value && (
                                <Text className="text-pink-500 font-bold">✓</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Text Size</Text>
                <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                    {sizeOptions.map((option, index) => (
                        <TouchableOpacity
                            key={option.value}
                            className={`p-4 flex-row justify-between items-center ${index !== sizeOptions.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                                }`}
                            onPress={() => setFontSize(option.value as any)}
                        >
                            <Text className="text-base text-gray-800 dark:text-gray-200" style={{ fontSize: index === 0 ? 14 : index === 1 ? 16 : index === 2 ? 18 : 20 }}>
                                {option.label}
                            </Text>
                            {fontSize === option.value && (
                                <Text className="text-pink-500 font-bold">✓</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="text-gray-500 dark:text-gray-400 mt-2 text-sm px-2 mb-8">
                    Adjusts the font size for forum posts and threads.
                </Text>

                <Text className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Developer</Text>
                <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                    <TouchableOpacity
                        className="p-4 flex-row justify-between items-center"
                        onPress={() => router.push('/debug')}
                    >
                        <View className="flex-row items-center">
                            <Text className="text-base text-gray-800 dark:text-gray-200">Debug Panel</Text>
                        </View>
                        <Text className="text-gray-400">{">"}</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-gray-500 dark:text-gray-400 mt-2 text-sm px-2">
                    Submit issues and feature requests directly to GitHub.
                </Text>
            </View>
        </ScrollView>
    );
}
