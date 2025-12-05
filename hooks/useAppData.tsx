import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { MAX_DAYS } from "@/constants/consts";
import { rescheduleNotifications } from "@/tools/notifications";

const START_DATE_KEY = "startDate" as const;
const NOTIFICATION_TIME_KEY = "notificationTime" as const;
const PE_LOG_KEY = "peLog" as const;

export interface PE {
	P: number;
	E: number;
}

export function useAppData() {
	const [startDate, setStartDate] = useState<Date>(new Date(0));
	const [notificationTime, setNotificationTime] = useState<Date>(new Date(0));
	const [peLog, setPeLog] = useState<PE[]>(Array(MAX_DAYS).fill({ P: 0, E: 0 }));
	const [loaded, setLoaded] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			try {
				const retrievedStartDate = await AsyncStorage.getItem(START_DATE_KEY);
				if (retrievedStartDate) setStartDate(new Date(retrievedStartDate));
			} catch {}
			try {
				const retrievedNotificationTime = await AsyncStorage.getItem(NOTIFICATION_TIME_KEY);
				if (retrievedNotificationTime) setNotificationTime(new Date(retrievedNotificationTime));
			} catch {}
			try {
				const retrievedPeLog = await AsyncStorage.getItem(PE_LOG_KEY);
				if (retrievedPeLog) setPeLog(JSON.parse(retrievedPeLog));
			} catch {}

			setLoaded(true);
		})();
	}, []);

	function setSinglePeLog(day: number, pe: PE) {
		setPeLog((prev) => {
			const newPeLog = [...prev];
			newPeLog[day] = pe;
			return newPeLog;
		});
	}

	useEffect(() => {
		if (!loaded) return;

		rescheduleNotifications({ startDate, peLog, hour: 9 });
	}, [startDate, peLog]);

	useEffect(() => {
		if (!loaded) return;
		AsyncStorage.setItem(START_DATE_KEY, startDate.toISOString());
	}, [startDate]);

	useEffect(() => {
		if (!loaded) return;
		AsyncStorage.setItem(NOTIFICATION_TIME_KEY, notificationTime.toISOString());
		console.log(notificationTime);
	}, [notificationTime]);

	useEffect(() => {
		if (!loaded) return;
		AsyncStorage.setItem(PE_LOG_KEY, JSON.stringify(peLog));
	}, [peLog]);

	return { startDate, setStartDate, notificationTime, setNotificationTime, peLog, setPeLog: setSinglePeLog, loaded };
}
