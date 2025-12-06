import { MAX_DAYS } from "@/constants/consts";
import { Colours } from "@/constants/theme";
import { useAppData } from "@/hooks/useAppData";
import { DAY_MS, getCurrentDay, strippedTime } from "@/tools/time";
import { useRouter } from "expo-router";
import { AlarmClock, CalendarCog, Minus, Plus, RotateCcw } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export default function CounterPage() {
	const router = useRouter();

	const { startDate, setStartDate, notificationTime, setNotificationTime } = useAppData();
	const currentDay = getCurrentDay(startDate);

	const [timePickerDate, setTimePickerDate] = useState<Date>(new Date());
	const [timePickerShown, setTimePickerShown] = useState<boolean>(false);

	function increment() {
		if (currentDay >= 28) return;

		setStartDate((prev) => {
			return strippedTime(new Date(prev.getTime() - DAY_MS));
		});
	}

	function decrement() {
		if (currentDay < 0) return;

		setStartDate((prev) => {
			return strippedTime(new Date(prev.getTime() + DAY_MS));
		});
	}

	function reset() {
		setStartDate((prev) => {
			return strippedTime(new Date());
		});
	}

	function selectNotificationTime() {
		setTimePickerDate(new Date(notificationTime));
		setTimePickerShown(true);
	}

	function confirmNotificationTime(_e: DateTimePickerEvent, date?: Date | undefined) {
		setTimePickerShown(false);

		if (!date) return;
		setNotificationTime(date);
	}

	return (
		<View style={{ ...styles.container }}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>PE Log</Text>
				<View style={styles.headerButtons}>
					<TouchableOpacity style={styles.settingsButton} onPress={selectNotificationTime}>
						<AlarmClock color={Colours.text} size={24} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/config")}>
						<CalendarCog color={Colours.text} size={24} />
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.main}>
				<View style={styles.dayContainer}>
					<Text style={styles.dayLabel}>Current Day</Text>
					<Text style={styles.dayCount}>{currentDay + 1}</Text>
					<Text style={styles.dayLimit}>of {MAX_DAYS}</Text>
				</View>

				<View style={styles.buttonRow}>
					<TouchableOpacity
						onPress={decrement}
						disabled={currentDay <= 0}
						style={[styles.buttonBase, styles.prevButton, currentDay <= 0 && styles.buttonDisabled]}
					>
						<Minus color={currentDay <= 1 ? Colours.muted : Colours.text} size={24} />
						<Text style={[styles.buttonText, { color: currentDay <= 1 ? Colours.muted : Colours.text }]}>Previous</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={increment}
						disabled={currentDay >= MAX_DAYS - 1}
						style={[styles.buttonBase, styles.nextButton, currentDay >= MAX_DAYS - 1 && styles.buttonDisabled]}
					>
						<Text style={[styles.buttonText, { color: currentDay >= MAX_DAYS - 1 ? Colours.muted : Colours.text }]}>
							Next
						</Text>
						<Plus color={currentDay >= MAX_DAYS ? Colours.muted : Colours.text} size={24} />
					</TouchableOpacity>
				</View>

				<TouchableOpacity onPress={reset} style={styles.resetButton}>
					<RotateCcw color={Colours.lightText} size={20} style={{ marginRight: 8 }} />
					<Text style={styles.resetButtonText}>Reset to Day 1</Text>
				</TouchableOpacity>
			</View>

			{timePickerShown && (
				<DateTimePicker
					value={timePickerDate}
					mode="time"
					is24Hour={false}
					onChange={confirmNotificationTime}
					timeZoneName="UTC"
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	header: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: Colours.divider,
	},
	headerButtons: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: Colours.text,
	},
	settingsButton: {
		padding: 8,
	},

	main: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 32,
		width: "100%",
	},
	dayContainer: {
		alignItems: "center",
		marginBottom: 48,
	},
	dayLabel: {
		color: Colours.muted,
		fontSize: 14,
		marginBottom: 8,
	},
	dayCount: {
		fontSize: 120,
		fontWeight: "bold",
		color: Colours.primary,
		lineHeight: 120,
	},
	dayLimit: {
		color: Colours.muted,
		fontSize: 14,
		marginTop: 8,
	},

	buttonRow: {
		flexDirection: "row",
		gap: 16,
		width: "100%",
		maxWidth: 400,
		marginBottom: 24,
	},
	buttonBase: {
		flex: 1,
		height: 64,
		borderRadius: 8,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		fontSize: 18,
		fontWeight: "600",
	},
	prevButton: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: Colours.divider,
	},
	nextButton: {
		backgroundColor: Colours.primary,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	resetButton: {
		width: "100%",
		maxWidth: 400,
		height: 56,
		backgroundColor: Colours.lightBackground,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
	},
	resetButtonText: {
		fontSize: 18,
		fontWeight: "600",
		color: Colours.lightText,
	},
});
