import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    const themeOptions = [
        { label: 'System Default', value: 'system' },
        { label: 'Light Mode', value: 'light' },
        { label: 'Dark Mode', value: 'dark' },
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

                <Text className="text-gray-500 dark:text-gray-400 mt-2 text-sm px-2">
                    Select your preferred appearance for the app.
                </Text>
            </View>
        </ScrollView>
    );
}
