import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const Storage = {
    setItem: async (key: string, value: string) => {
        if (Platform.OS === 'web') {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.warn('LocalStorage not available', e);
            }
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    },

    getItem: async (key: string): Promise<string | null> => {
        if (Platform.OS === 'web') {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                return null;
            }
        } else {
            return await SecureStore.getItemAsync(key);
        }
    },

    deleteItem: async (key: string) => {
        if (Platform.OS === 'web') {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                // ignore
            }
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    }
};
