import { Platform } from "react-native";

export const MAX_DAYS = 28 as const;

export const Colours = {
	// Base styles
	background: "#1e1e1e",
	divider: "#3a3a3a",
	// For main elements
	text: "#ededed",
	muted: "#b0b0b0",
	// Accent colour
	primary: "#8C4BA7",
	// For lighter elements
	lightBackground: "#cccccc",
	lightText: "#111111",
	lightMuted: "#555555",
} as const;

export const Fonts = Platform.select({
	ios: {
		/** iOS `UIFontDescriptorSystemDesignDefault` */
		sans: "system-ui",
		/** iOS `UIFontDescriptorSystemDesignSerif` */
		serif: "ui-serif",
		/** iOS `UIFontDescriptorSystemDesignRounded` */
		rounded: "ui-rounded",
		/** iOS `UIFontDescriptorSystemDesignMonospaced` */
		mono: "ui-monospace",
	},
	default: {
		sans: "normal",
		serif: "serif",
		rounded: "normal",
		mono: "monospace",
	},
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif",
		rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	},
});

export const DAY_MS = 86400000 as const; // 1000 * 60 * 60 * 24
