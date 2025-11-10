/**
 * Theme Domain Constants
 */

import type { Theme, ThemeName } from './types';

export const THEMES: Record<ThemeName, Theme> = {
	Professional: {
		name: 'Professional',
		colors: {
			primary: '#1a3a52',
			secondary: '#2c5aa0',
			accent: '#d4af37',
			text: '#333333',
			background: '#ffffff',
			border: '#cccccc'
		},
		description: 'Professional blue and gold theme'
	},
	Modern: {
		name: 'Modern',
		colors: {
			primary: '#2196F3',
			secondary: '#1976D2',
			accent: '#FF9800',
			text: '#212121',
			background: '#fafafa',
			border: '#e0e0e0'
		},
		description: 'Modern blue and orange theme'
	},
	Classic: {
		name: 'Classic',
		colors: {
			primary: '#8B4513',
			secondary: '#A0522D',
			accent: '#DAA520',
			text: '#2c2c2c',
			background: '#fffaf0',
			border: '#d2b48c'
		},
		description: 'Classic brown and gold theme'
	},
	Minimal: {
		name: 'Minimal',
		colors: {
			primary: '#000000',
			secondary: '#333333',
			accent: '#666666',
			text: '#000000',
			background: '#ffffff',
			border: '#eeeeee'
		},
		description: 'Minimal black and white theme'
	}
};

export const DEFAULT_THEME: ThemeName = 'Professional';
export const AVAILABLE_THEMES: ThemeName[] = Object.keys(THEMES) as ThemeName[];
