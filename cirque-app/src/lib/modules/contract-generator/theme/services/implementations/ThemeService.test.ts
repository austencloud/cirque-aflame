import { describe, it, expect } from 'vitest';
import { ThemeService } from './ThemeService';
import { AVAILABLE_THEMES } from '../../domain';

describe('ThemeService', () => {
	const service = new ThemeService();

	it('should get available themes', () => {
		const themes = service.getAvailableThemes();
		expect(Array.isArray(themes)).toBe(true);
		expect(themes.length).toBeGreaterThan(0);
	});

	it('should get theme', () => {
		const theme = service.getTheme('Professional');
		expect(theme).toBeDefined();
		expect(theme.name).toBe('Professional');
	});

	it('should get theme colors', () => {
		const colors = service.getThemeColors('Professional');
		expect(colors).toBeDefined();
		expect(colors.primary).toBeDefined();
		expect(colors.secondary).toBeDefined();
		expect(colors.accent).toBeDefined();
		expect(colors.text).toBeDefined();
		expect(colors.background).toBeDefined();
		expect(colors.border).toBeDefined();
	});

	it('should check if theme exists', () => {
		expect(service.themeExists('Professional')).toBe(true);
		expect(service.themeExists('Professional' as any)).toBe(true);
	});

	it('should generate CSS variables', () => {
		const css = service.getThemeCSSVariables('Professional');
		expect(typeof css).toBe('string');
		expect(css).toContain('--primary');
		expect(css).toContain('--secondary');
	});

	it('should have all available themes', () => {
		AVAILABLE_THEMES.forEach((themeName) => {
			expect(service.themeExists(themeName)).toBe(true);
		});
	});
});
