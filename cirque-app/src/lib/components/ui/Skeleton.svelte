<!-- src/lib/components/ui/Skeleton.svelte -->
<script lang="ts">
	interface Props {
		variant?: 'text' | 'rectangular' | 'circular' | 'card';
		width?: string;
		height?: string;
		class?: string;
	}
	const { variant = 'text', width, height, class: className = '' }: Props = $props();
</script>

<div class="skeleton {variant} {className}" style:width style:height data-component="Skeleton" />

<style>
	.skeleton {
		background: linear-gradient(
			to right,
			var(--color-gray-200),
			var(--color-gray-100),
			var(--color-gray-200)
		);
		background-size: 1000px 100%;
		animation: shimmer 2s linear infinite;
	}
	.skeleton.text {
		height: 1rem;
		border-radius: var(--radius-sm);
		width: 100%;
	}
	.skeleton.rectangular {
		border-radius: var(--radius-lg);
	}
	.skeleton.circular {
		border-radius: var(--radius-full);
	}
	.skeleton.card {
		border-radius: var(--radius-xl);
		height: 12rem;
		width: 100%;
	}
	@keyframes shimmer {
		0% {
			background-position: -1000px 0;
		}
		100% {
			background-position: 1000px 0;
		}
	}
</style>
