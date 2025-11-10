<script lang="ts">
	import { createThemeState } from '../state';
	import type { ThemeName } from '../domain';
	const themeState = createThemeState();
</script>

<div class="theme-selector">
	<label for="theme-select">Theme:</label>
	<select
		id="theme-select"
		value={themeState.currentTheme}
		onchange={(e) => themeState.setTheme((e.target as HTMLSelectElement).value as ThemeName)}
	>
		{#each themeState.availableThemes as theme} <option value={theme}>{theme}</option> {/each}
	</select>
</div>

<style>
	.theme-selector {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	label {
		font-weight: 500;
		color: #333;
	}
	select {
		padding: 6px 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 14px;
		cursor: pointer;
		background: white;
	}
	select:hover {
		border-color: #999;
	}
	select:focus {
		outline: none;
		border-color: #2196f3;
		box-shadow: 0 0 5px rgba(33, 150, 243, 0.3);
	}
</style>
