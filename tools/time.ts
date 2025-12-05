export const DAY_MS = 86400000 as const; // 1000 * 60 * 60 * 24

export function getCurrentDay(startDate: Date) {
	return Math.floor((Date.now() - startDate.getTime()) / DAY_MS);
}
