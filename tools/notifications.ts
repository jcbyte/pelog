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

const DEFAULT_FUTURE_CYCLES = 2 as const;

interface NotificationSchedulingOptions {
	startDate: Date;
	peLog: PE[];
	notificationTime: Date;
	futureCycles?: number;
}

async function scheduleNotifications(options: NotificationSchedulingOptions) {
	const currentDay = Math.floor((Date.now() - options.startDate.getTime()) / DAY_MS);

	const notificationSchedules: Promise<unknown>[] = [];
	for (let i = 0; i < MAX_DAYS * (options.futureCycles ?? DEFAULT_FUTURE_CYCLES); i++) {
		const triggerDate = new Date(options.startDate.getTime() + i * DAY_MS);
		triggerDate.setHours(options.notificationTime.getHours(), options.notificationTime.getMinutes());
		const thisDay = (currentDay + i) % MAX_DAYS;

		notificationSchedules.push(
			scheduleNotificationAsync({
				content: {
					title: `PE Log - Day ${thisDay + 1}`,
					body: `P: ${options.peLog[thisDay].P}% | E: ${options.peLog[thisDay].E}%`,
				},
				trigger: { type: SchedulableTriggerInputTypes.DATE, date: triggerDate },
			})
		);
	}

	const triggerDate = new Date(options.startDate.getTime() + (MAX_DAYS - 1) * DAY_MS);
	triggerDate.setHours(options.notificationTime.getHours(), options.notificationTime.getMinutes());
	notificationSchedules.push(
		scheduleNotificationAsync({
			content: {
				title: "PE Log",
				body: "Reopen the app to continue receiving notifications!",
			},
			trigger: { type: SchedulableTriggerInputTypes.DATE, date: triggerDate },
		})
	);

	await Promise.all(notificationSchedules);
}

let rescheduling = false;
let pending_reschedule: NotificationSchedulingOptions | null = null;

export async function rescheduleNotifications(options: NotificationSchedulingOptions) {
	// call the function immediately, however if currently rescheduling
	// we let it finish before calling with the new data; however, if
	// multiple reschedule calls come in only the last will be fired

	if (rescheduling) {
		pending_reschedule = options;
		return;
	}

	rescheduling = true;
	console.log("Rescheduling");
	await cancelAllScheduledNotificationsAsync();
	await scheduleNotifications(options);
	rescheduling = false;

	if (pending_reschedule) {
		const next_call = { ...pending_reschedule };
		pending_reschedule = null;
		rescheduleNotifications(next_call);
	}
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
		return;
	}
}
