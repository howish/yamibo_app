import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password.');
            return;
        }

        setLoading(true);
        try {
            await login(username, password);
            // On Web, Alert.alert with callback might be flaky. Just go back.
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Login Failed', 'Invalid credentials or server error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white p-6 justify-center">
            <Text className="text-3xl font-bold text-center mb-8 text-gray-800">Yamibo Login</Text>

            <View className="space-y-4">
                <View>
                    <Text className="text-gray-600 mb-1 ml-1">Username</Text>
                    <TextInput
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-base"
                        placeholder="Enter your username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        editable={!loading}
                    />
                </View>

                <View>
                    <Text className="text-gray-600 mb-1 ml-1 pt-4">Password</Text>
                    <TextInput
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-base"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!loading}
                    />
                </View>

                <TouchableOpacity
                    className={`w-full bg-pink-500 p-4 rounded-lg mt-8 active:bg-pink-600 ${loading ? 'opacity-70' : ''}`}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-center font-bold text-lg">Sign In (API)</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/login-web')}
                    className="w-full bg-blue-500 p-4 rounded-lg mt-4 active:bg-blue-600"
                >
                    <Text className="text-white text-center font-bold text-lg">Web Login (Recommended)</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-pink-500 text-center">Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
