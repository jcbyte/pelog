import { Stack } from "expo-router";
import React from "react";

import { Colours } from "@/constants/consts";

export default function StackLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: Colours.background },
			}}
		>
			<Stack.Screen name="counter" />
			<Stack.Screen name="config" />
		</Stack>
	);
}
