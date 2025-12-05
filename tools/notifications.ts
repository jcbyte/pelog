import { DAY_MS, MAX_DAYS } from "@/constants/constants";
import { PE } from "@/hooks/useAppData";
import {
	cancelAllScheduledNotificationsAsync,
	PermissionStatus,
	requestPermissionsAsync,
	SchedulableTriggerInputTypes,
	scheduleNotificationAsync,
} from "expo-notifications";
import { Alert, Linking } from "react-native";

async function scheduleNotifications(startDate: Date, peLog: PE[], hour: number, futureCycles: number) {
	const currentDay = Math.floor((Date.now() - startDate.getTime()) / DAY_MS);

	for (let i = 0; i < MAX_DAYS * futureCycles; i++) {
		const triggerDate = new Date(startDate.getTime() + i * DAY_MS);
		triggerDate.setHours(hour);
		const thisDay = (currentDay + i) % MAX_DAYS;

		await scheduleNotificationAsync({
			content: {
				title: "PE Log",
				body: `P=${peLog[thisDay].P}% E${peLog[thisDay].E}%`,
			},
			trigger: { type: SchedulableTriggerInputTypes.DATE, date: triggerDate },
		});
	}
}

export async function rescheduleNotifications(startDate: Date, peLog: PE[], hour: number, futureCycles: number = 4) {
	console.log("rescheduling");
	await cancelAllScheduledNotificationsAsync();
	await scheduleNotifications(startDate, peLog, hour, futureCycles);
}

export async function requestNotificationPermission() {
	let status: PermissionStatus | undefined;
	while (!status || status === PermissionStatus.UNDETERMINED) {
		({ status } = await requestPermissionsAsync());
	}

	if (status === PermissionStatus.DENIED) {
		Alert.alert("Permission Required", "Please go to your device settings to enable the required permission.", [
			{ text: "Cancel" },
			{ text: "Open Settings", onPress: () => Linking.openSettings() },
		]);
	}
}
