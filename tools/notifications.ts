import { DAY_MS, MAX_DAYS } from "@/constants/constants";
import { PE } from "@/hooks/useAppData";
import {
	cancelAllScheduledNotificationsAsync,
	requestPermissionsAsync,
	SchedulableTriggerInputTypes,
	scheduleNotificationAsync,
} from "expo-notifications";

async function scheduleNotifications(startDate: Date, peLog: PE[], hour: number, futureCycles: number) {
	const { status } = await requestPermissionsAsync();

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
	await cancelAllScheduledNotificationsAsync();
	await scheduleNotifications(startDate, peLog, hour, futureCycles);
}
