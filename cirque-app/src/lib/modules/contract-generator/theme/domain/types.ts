/**
 * Theme Domain Types
 */

export type ThemeName = 'Professional' | 'Modern' | 'Classic' | 'Minimal';

export interface ThemeColors {
	primary: string;
	secondary: string;
	accent: string;
	text: string;
	background: string;
	border: string;
}

export interface Theme {
	name: ThemeName;
	colors: ThemeColors;
	description: string;
}
