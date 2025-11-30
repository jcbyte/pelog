import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { MAX_DAYS } from "@/constants/constants";

export interface PE {
	P: number;
	E: number;
}

export function usePeLog() {
	const [peLog, setPeLog] = useState<PE[]>(Array(MAX_DAYS).fill({ P: 0, E: 0 }));
	const [loaded, setLoaded] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const retrieved = await AsyncStorage.getItem("peLog");
			if (retrieved) setPeLog(JSON.parse(retrieved));
			setLoaded(true);
		})();
	}, []);

	useEffect(() => {
		AsyncStorage.setItem("peLog", JSON.stringify(peLog));
	}, peLog);

	return { peLog, setPeLog, loaded };
}
