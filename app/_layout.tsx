import { Colours } from "@/constants/theme";
import { useAppData } from "@/hooks/useAppData";
import { requestNotificationPermission } from "@/tools/notifications";
import { Stack } from "expo-router";
import { hide as hideSplashScreen, preventAutoHideAsync as preventAutoHideSplashScreenAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

preventAutoHideSplashScreenAsync();

export default function App() {
	const { loaded } = useAppData();

	useEffect(() => {
		requestNotificationPermission();
	});

	useEffect(() => {
		if (loaded) hideSplashScreen();
	}, [loaded]);

	return (
		<>
			<StatusBar style="light" />
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1, backgroundColor: Colours.background }}>
					<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colours.background } }}>
						<Stack.Screen name="index" />
						<Stack.Screen name="config" />
					</Stack>
				</SafeAreaView>
			</SafeAreaProvider>
		</>
	);
}
