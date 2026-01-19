import React, { useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function LoginWebView() {
    const router = useRouter();
    const { loginWithWeb } = useAuth();
    const webViewRef = useRef(null);

    const handleNavigationStateChange = (navState) => {
        const { url } = navState;

        // Check for success condition (e.g., redirect to home page after login)
        // The mobile version often redirects to forum.php?mobile=1 or similar
        if (url.includes('bbs.yamibo.com') && !url.includes('mod=logging') && !url.includes('action=login')) {
            // Inject JS to get cookies
            const injectCookieScript = `
        window.ReactNativeWebView.postMessage(document.cookie);
        true;
      `;
            webViewRef.current?.injectJavaScript(injectCookieScript);
        }
    };

    const handleMessage = async (event) => {
        const cookieString = event.nativeEvent.data;
        if (cookieString) {
            console.log("Extracted Cookies:", cookieString);
            const success = await loginWithWeb(cookieString);
            if (success) {
                router.replace('/');
            }
        }
    };

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                source={{ uri: 'https://bbs.yamibo.com/member.php?mod=logging&action=login&mobile=2' }}
                onNavigationStateChange={handleNavigationStateChange}
                onMessage={handleMessage}
                startInLoadingState={true}
                renderLoading={() => <ActivityIndicator size="large" color="#FFC0CB" style={styles.loading} />}
                style={{ flex: 1 }}
                // Fake user agent to ensure we get the mobile version if needed
                userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36 YamiboApp/1.0"
                incognito={true}
                sharedCookiesEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loading: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 1,
    }
});
