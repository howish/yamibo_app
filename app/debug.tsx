import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Storage } from '../utils/storage';
import { GitHubService } from '../services/github.ts';
import { Ionicons } from '@expo/vector-icons';

const GITHUB_PAT_KEY = 'github_pat';

export default function DebugPanel() {
    const router = useRouter();
    const [pat, setPat] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const [savingPat, setSavingPat] = useState(false);

    useEffect(() => {
        loadPat();
    }, []);

    const loadPat = async () => {
        const savedPat = await Storage.getItem(GITHUB_PAT_KEY);
        if (savedPat) setPat(savedPat);
    };

    const savePat = async () => {
        setSavingPat(true);
        try {
            await Storage.setItem(GITHUB_PAT_KEY, pat);
            Alert.alert('Success', 'GitHub PAT saved securely.');
        } catch (e) {
            Alert.alert('Error', 'Failed to save PAT.');
        } finally {
            setSavingPat(false);
        }
    };

    const handleSubmit = async () => {
        if (!pat) {
            Alert.alert('Error', 'Please provide a GitHub Personal Access Token.');
            return;
        }
        if (!title || !body) {
            Alert.alert('Error', 'Please fill in both title and description.');
            return;
        }

        setLoading(true);
        try {
            const issue = await GitHubService.submitIssue({ title, body }, pat);
            Alert.alert(
                'Issue Submitted',
                `Successfully created issue #${issue.number} on GitHub.`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error: any) {
            Alert.alert('Submission Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white dark:bg-slate-900"
        >
            <Stack.Screen options={{ title: 'Debug Panel', headerTitleStyle: { fontWeight: 'bold' } }} />

            <ScrollView className="flex-1 p-6">
                <View className="mb-8">
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Submit an Issue
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400">
                        Report bugs or suggest features directly to our GitHub repository.
                    </Text>
                </View>

                {/* GitHub PAT Configuration */}
                <View className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="key-outline" size={20} color="#3b82f6" />
                        <Text className="ml-2 font-semibold text-blue-800 dark:text-blue-300">
                            GitHub Configuration
                        </Text>
                    </View>
                    <Text className="text-xs text-blue-600 dark:text-blue-400 mb-3">
                        Enter your Personal Access Token (classic) with 'repo' scope.
                    </Text>
                    <View className="flex-row items-center">
                        <TextInput
                            className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-xl border border-blue-200 dark:border-blue-700 text-slate-900 dark:text-white text-sm"
                            placeholder="ghp_xxxxxxxxxxxx"
                            placeholderTextColor="#94a3b8"
                            value={pat}
                            onChangeText={setPat}
                            secureTextEntry
                        />
                        <TouchableOpacity
                            onPress={savePat}
                            disabled={savingPat}
                            className="ml-2 bg-blue-500 p-3 rounded-xl"
                        >
                            {savingPat ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text className="text-white font-bold text-xs">Save</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Issue Form */}
                <View className="space-y-4">
                    <View>
                        <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                            Issue Title
                        </Text>
                        <TextInput
                            className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            placeholder="Brief summary of the issue"
                            placeholderTextColor="#94a3b8"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                            Description
                        </Text>
                        <TextInput
                            className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white h-40"
                            placeholder="Describe the bug or feature request in detail..."
                            placeholderTextColor="#94a3b8"
                            value={body}
                            onChangeText={setBody}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading}
                        className={`mt-4 p-4 rounded-2xl flex-row justify-center items-center ${loading ? 'bg-slate-400' : 'bg-indigo-600 shadow-lg shadow-indigo-500/30'
                            }`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" className="mr-2" />
                        ) : (
                            <Ionicons name="paper-plane" size={20} color="white" className="mr-2" />
                        )}
                        <Text className="text-white font-bold text-lg ml-2">
                            {loading ? 'Submitting...' : 'Submit Issue'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="h-20" />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
