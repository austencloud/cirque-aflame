<!-- src/lib/components/ui/FloatingInput.svelte -->
<script lang="ts">
	interface Props {
		id: string;
		label: string;
		type?: string;
		value?: string | number;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		error?: string;
		class?: string;
		onchange?: (e: Event) => void;
		oninput?: (e: Event) => void;
	}
	let {
		id,
		label,
		type = 'text',
		value = $bindable(''),
		placeholder = ' ',
		disabled = false,
		required = false,
		error,
		class: className = '',
		onchange,
		oninput
	}: Props = $props();
	const hasValue = $derived(value !== '' && value !== null && value !== undefined);
</script>

<div class="floating-input-wrapper {className}" data-component="FloatingInput">
	<input
		{id}
		{type}
		bind:value
		{placeholder}
		{disabled}
		{required}
		{onchange}
		{oninput}
		class="floating-input {error ? 'floating-input-error' : ''}"
	/>
	<label
		for={id}
		class="floating-label {hasValue || placeholder !== ' ' ? 'floating-label-float' : ''} {error
			? 'floating-label-error'
			: ''}"
	>
		{label}
		{#if required} <span class="floating-label-required">*</span> {/if}
	</label>
	{#if error} <p class="floating-input-error-message">{error}</p> {/if}
</div>

<style>
	.floating-input-wrapper {
		position: relative;
	}
	.floating-input {
		width: 100%;
		padding: 1.5rem 1rem 0.5rem 1rem;
		border: 2px solid var(--color-gray-300);
		border-radius: var(--radius-lg);
		transition: all var(--transition-base);
		background: white;
		color: var(--color-gray-900);
		font-size: 1rem;
	}
	.floating-input:focus {
		outline: none;
		border-color: var(--color-flame-500);
		box-shadow: var(--shadow-glow-sm);
	}
	.floating-input::placeholder {
		color: transparent;
	}
	.floating-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.dark .floating-input {
		background: var(--color-gray-800);
		color: var(--color-gray-100);
		border-color: var(--color-gray-600);
	}
	.floating-input-error {
		border-color: var(--color-red-400);
	}
	.floating-input-error:focus {
		border-color: var(--color-red-500);
		box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
	}
	.dark .floating-input-error {
		border-color: var(--color-red-500);
	}
	.floating-label {
		position: absolute;
		left: 1rem;
		top: 1rem;
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-gray-500);
		transition: all var(--transition-base);
		pointer-events: none;
	}
	.floating-input:focus ~ .floating-label,
	.floating-label-float {
		top: 0.5rem;
		font-size: 0.75rem;
	}
	.floating-input:focus ~ .floating-label {
		color: var(--color-flame-600);
	}
	.dark .floating-label {
		color: var(--color-gray-400);
	}
	.dark .floating-input:focus ~ .floating-label {
		color: var(--color-flame-400);
	}
	.floating-label-error {
		color: var(--color-red-500);
	}
	.dark .floating-label-error {
		color: var(--color-red-400);
	}
	.floating-input:focus ~ .floating-label-error {
		color: var(--color-red-500);
	}
	.dark .floating-input:focus ~ .floating-label-error {
		color: var(--color-red-400);
	}
	.floating-label-required {
		color: var(--color-red-500);
	}
	.floating-input-error-message {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: var(--color-red-500);
	}
	.dark .floating-input-error-message {
		color: var(--color-red-400);
	}
</style>
