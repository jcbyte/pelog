import { MAX_DAYS } from "@/constants/consts";
import { PE } from "@/hooks/useAppData";
import {
	cancelAllScheduledNotificationsAsync,
	PermissionStatus,
	requestPermissionsAsync,
	SchedulableTriggerInputTypes,
	scheduleNotificationAsync,
} from "expo-notifications";
import { Alert, Linking } from "react-native";
import { DAY_MS } from "./time";

async function scheduleNotifications(startDate: Date, peLog: PE[], hour: number, futureCycles: number) {
	const currentDay = Math.floor((Date.now() - startDate.getTime()) / DAY_MS);

	const notificationSchedules: Promise<unknown>[] = [];
	for (let i = 0; i < MAX_DAYS * futureCycles; i++) {
		const triggerDate = new Date(startDate.getTime() + i * DAY_MS);
		triggerDate.setHours(hour);
		const thisDay = (currentDay + i) % MAX_DAYS;

		notificationSchedules.push(
			scheduleNotificationAsync({
				content: {
					title: "PE Log",
					body: `P=${peLog[thisDay].P}% E${peLog[thisDay].E}%`,
				},
				trigger: { type: SchedulableTriggerInputTypes.DATE, date: triggerDate },
			})
		);
	}

	const triggerDate = new Date(startDate.getTime() + (MAX_DAYS - 1) * DAY_MS);
	triggerDate.setHours(hour);
	notificationSchedules.push(
		scheduleNotificationAsync({
			content: {
				title: "PE Log",
				body: "Reopen the app to continue receiving notifications",
			},
			trigger: { type: SchedulableTriggerInputTypes.DATE, date: triggerDate },
		})
	);

	await Promise.all(notificationSchedules);
}

let rescheduling = false;
let rescheduling_timeout: number;
export async function rescheduleNotifications(startDate: Date, peLog: PE[], hour: number, futureCycles: number = 4) {
	// call the function immediately, however if currently rescheduling
	// we let it finish before calling with the new data; however, if
	// multiple reschedule calls come in only the last will be fired

	if (rescheduling_timeout) clearTimeout(rescheduling_timeout);
	if (rescheduling) {
		rescheduling_timeout = setTimeout(() => {
			rescheduleNotifications(startDate, peLog, hour, futureCycles);
		}, 500);
		return;
	}

	rescheduling = true;
	console.log("rescheduling");
	await cancelAllScheduledNotificationsAsync();
	await scheduleNotifications(startDate, peLog, hour, futureCycles);
	rescheduling = false;
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
