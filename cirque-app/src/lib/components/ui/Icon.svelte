<script lang="ts">
	import Fa from 'svelte-fa';
	import * as solidIcons from '@fortawesome/free-solid-svg-icons';
	import type { IconSize } from 'svelte-fa';

	interface Props {
		name: string;
		size?: string | number;
		extraClass?: string;
		class?: string; // Alias for extraClass
		color?: string;
	}

	const { name, size = '1x', extraClass = '', class: className = '', color }: Props = $props();

	// Valid svelte-fa sizes
	const validSizes: IconSize[] = ['xs', 'sm', 'lg', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'];

	// Convert number size to string with 'px' suffix
	const sizeString = typeof size === 'number' ? `${size}px` : size;

	// Check if size is a valid IconSize
	const isValidSize = validSizes.includes(sizeString as IconSize);
	const faSize = isValidSize ? (sizeString as IconSize) : '1x';
	const customStyle = !isValidSize ? `font-size: ${sizeString};` : '';

	// Combine extraClass and class
	const combinedClass = extraClass || className;

	// Convert kebab-case to camelCase with 'fa' prefix for Font Awesome icons
	function toFaIconName(str: string): string {
		const camelCase = str
			.split('-')
			.map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
			.join('');
		return 'fa' + camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
	}

	const iconName = toFaIconName(name);
	const icon = (solidIcons as any)[iconName];
</script>

{#if icon}
	<span style={customStyle} class="icon-wrapper {combinedClass}">
		<Fa {icon} size={faSize} {color} />
	</span>
{:else}
	<span class="icon-fallback {combinedClass}" style="font-size: {sizeString};">?</span>
{/if}

<style>
	.icon-wrapper {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.icon-fallback {
		display: inline-block;
	}
</style>
