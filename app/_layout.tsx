import { Colours } from "@/constants/constants";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
	return (
		<>
			<StatusBar style="light" />
			<SafeAreaProvider>
				<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colours.background } }}>
					<Stack.Screen name="(pages)" />
				</Stack>
			</SafeAreaProvider>
		</>
	);
}
