<!-- src/lib/components/ui/LoadingSpinner.svelte -->
<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		color?: 'blue' | 'white' | 'gray' | 'flame';
	}
	const { size = 'md', color = 'blue' }: Props = $props();
</script>

<div class="spinner-container" data-component="LoadingSpinner">
	<div class="spinner {size} {color}" aria-hidden="true">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="spinner-path"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	</div>
</div>

<style>
	.spinner-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.spinner {
		animation: spin 1s linear infinite;
	}
	.spinner svg {
		width: 100%;
		height: 100%;
	} /* Sizes */
	.spinner.sm {
		width: 1.25rem;
		height: 1.25rem;
	}
	.spinner.md {
		width: 2rem;
		height: 2rem;
	}
	.spinner.lg {
		width: 3rem;
		height: 3rem;
	} /* Colors */
	.spinner.blue {
		color: #2563eb;
	}
	.spinner.white {
		color: white;
	}
	.spinner.gray {
		color: var(--color-gray-500);
	}
	.spinner.flame {
		color: var(--color-flame-500);
	} /* SVG elements */
	.spinner-track {
		opacity: 0.25;
	}
	.spinner-path {
		opacity: 0.75;
	}
</style>
