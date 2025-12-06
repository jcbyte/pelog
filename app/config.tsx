import { Colours } from "@/constants/theme";
import { useAppData } from "@/hooks/useAppData";
import { getCurrentDay } from "@/tools/time";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function ConfigPage() {
	const router = useRouter();

	const { startDate, peLog, setPeLog } = useAppData();
	const currentDay = getCurrentDay(startDate);
	const [selectedDay, setSelectedDay] = useState<number | null>(null);
	const [drawerP, setDrawerP] = useState<string>("");
	const [drawerE, setDrawerE] = useState<string>("");

	function openDrawer(day: number) {
		setSelectedDay(day);
		setDrawerP(String(peLog[day].P));
		setDrawerE(String(peLog[day].E));
	}

	function closeDrawer() {
		setSelectedDay(null);
	}

	function savePe() {
		if (selectedDay === null) return;
		setPeLog(selectedDay, { P: Number(drawerP), E: Number(drawerE) });
		closeDrawer();
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.settingsButton} onPress={() => router.back()}>
					<ArrowLeft color={Colours.text} size={24} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Day Configuration</Text>
			</View>

			<ScrollView style={styles.mainContent}>
				<View style={styles.dayGrid}>
					{peLog.map((pe, day) => {
						return (
							<TouchableOpacity
								key={day}
								onPress={() => openDrawer(day)}
								style={{ ...styles.dayButton, ...(day === currentDay ? styles.todayDayButton : {}) }}
							>
								<Text style={styles.dayText}>{day + 1}</Text>
								<Text style={styles.dayConfigText}>P={pe.P}%</Text>
								<Text style={styles.dayConfigText}>E={pe.E}%</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			</ScrollView>

			<Modal visible={selectedDay !== null} animationType="slide" transparent={true} onRequestClose={closeDrawer}>
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
					<View style={styles.modalOverlay}>
						<View style={styles.drawerContent}>
							<View style={styles.drawerHeader}>
								<Text style={styles.drawerTitle}>Day {selectedDay! + 1}</Text>
								<Text style={styles.drawerDescription}>Set P and E values for this day</Text>
							</View>

							<View style={styles.drawerBody}>
								<View style={styles.inputGroup}>
									<Text style={styles.inputLabel}>P Value (%)</Text>
									<TextInput
										style={styles.input}
										placeholderTextColor={Colours.muted}
										keyboardType="numeric"
										value={drawerP}
										onChangeText={(text) => setDrawerP(text)}
										textAlign="center"
										placeholder="0"
									/>
								</View>

								<View style={styles.inputGroup}>
									<Text style={styles.inputLabel}>E Value (%)</Text>
									<TextInput
										style={styles.input}
										placeholderTextColor={Colours.muted}
										keyboardType="numeric"
										value={drawerE}
										onChangeText={(text) => setDrawerE(text)}
										textAlign="center"
										placeholder="0"
									/>
								</View>
							</View>

							<View style={styles.drawerFooter}>
								<TouchableOpacity style={styles.primaryButton} onPress={savePe}>
									<Text style={styles.primaryButtonText}>Save Day {selectedDay! + 1}</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.cancelButton} onPress={closeDrawer}>
									<Text style={styles.cancelButtonText}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>
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
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: Colours.divider,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: Colours.text,
	},
	settingsButton: {
		padding: 8,
	},

	mainContent: {
		flex: 1,
		padding: 24,
	},
	dayGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		gap: 6,
		alignSelf: "center",
	},
	dayButton: {
		width: 80,
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		backgroundColor: "transparent",
		borderColor: Colours.divider,
		alignItems: "center",
		justifyContent: "center",
	},
	todayDayButton: {
		borderColor: Colours.primary,
	},
	dayText: {
		fontSize: 18,
		fontWeight: "600",
		color: Colours.text,
	},
	dayConfigText: {
		fontSize: 12,
		lineHeight: 14,
		color: Colours.muted,
		fontWeight: "500",
	},

	modalOverlay: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	drawerContent: {
		backgroundColor: Colours.background,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 0,
		width: "100%",
		maxHeight: "80%",
	},
	drawerHeader: {
		paddingVertical: 10,
		alignItems: "center",
	},
	drawerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: Colours.text,
	},
	drawerDescription: {
		color: Colours.muted,
		marginTop: 4,
	},
	drawerBody: {
		paddingVertical: 24,
		gap: 8,
	},
	inputGroup: {
		gap: 4,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: "500",
		color: Colours.text,
	},
	input: {
		height: 56,
		fontSize: 18,
		borderWidth: 1,
		borderColor: Colours.divider,
		borderRadius: 8,
		paddingHorizontal: 12,
		backgroundColor: Colours.background,
		color: Colours.text,
	},
	drawerFooter: {
		paddingTop: 16,
		paddingBottom: 30,
		borderTopWidth: 1,
		borderTopColor: Colours.divider,
		gap: 8,
	},
	primaryButton: {
		backgroundColor: Colours.primary,
		borderRadius: 8,
		padding: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	primaryButtonText: {
		color: Colours.text,
		fontSize: 16,
		fontWeight: "600",
	},
	cancelButton: {
		borderColor: Colours.divider,
		borderWidth: 1,
		borderRadius: 8,
		padding: 15,
		backgroundColor: "transparent",
		alignItems: "center",
	},
	cancelButtonText: {
		color: Colours.text,
		fontSize: 16,
		fontWeight: "600",
	},
});
