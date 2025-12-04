import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { MAX_DAYS } from "@/constants/constants";

const PE_LOG_KEY = "peLog" as const;
const START_DATE_KEY = "startDate" as const;

export interface PE {
	P: number;
	E: number;
}

export function useAppData() {
	const [peLog, setPeLog] = useState<PE[]>(Array(MAX_DAYS).fill({ P: 0, E: 0 }));
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [loaded, setLoaded] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const retrievedPeLog = await AsyncStorage.getItem(PE_LOG_KEY);
			if (retrievedPeLog) setPeLog(JSON.parse(retrievedPeLog));
			const retrievedStartDate = await AsyncStorage.getItem(START_DATE_KEY);
			if (retrievedStartDate) setStartDate(new Date(retrievedStartDate));

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
		AsyncStorage.setItem(START_DATE_KEY, JSON.stringify(startDate));
	}, [startDate]);

	useEffect(() => {
		AsyncStorage.setItem(PE_LOG_KEY, JSON.stringify(peLog));
	}, [peLog]);

	return { startDate, setStartDate, peLog, setPeLog: setSinglePeLog, loaded };
}
