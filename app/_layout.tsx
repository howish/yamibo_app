import "../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

export default function Layout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Stack>
                    <Stack.Screen name="index" options={{ title: "Yamibo" }} />
                    <Stack.Screen name="login" options={{ presentation: 'modal', title: 'Login' }} />
                </Stack>
            </AuthProvider>
        </ThemeProvider>
    );
}
