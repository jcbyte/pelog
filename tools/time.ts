import { MAX_DAYS } from "@/constants/consts";

export const DAY_MS = 86400000 as const; // 1000 * 60 * 60 * 24

export function getCurrentDay(startDate: Date) {
	return Math.floor((Date.now() - startDate.getTime()) / DAY_MS);
}

export function strippedTime(date: Date): Date {
	const newDate = new Date(date);
	newDate.setHours(0, 0, 0, 0);
	return newDate;
}

export function getClosestStartDate(startDate: Date): Date | null {
	const timeDiff = Date.now() - startDate.getTime();
	const completedCycles = Math.floor(timeDiff / (MAX_DAYS * DAY_MS));

	if (!completedCycles) return null;

	const newStartDate = new Date(startDate.getTime() + completedCycles * MAX_DAYS * DAY_MS);
	return strippedTime(newStartDate);
}
