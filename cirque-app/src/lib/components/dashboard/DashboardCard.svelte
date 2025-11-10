<!-- src/lib/components/dashboard/DashboardCard.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/ui/Icon.svelte';
	interface Props {
		title: string;
		value: number;
		icon: string;
		color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'flame' | 'gold' | 'royal' | 'cyan';
		isCurrency?: boolean;
		link?: string | null;
	}
	const { title, value, icon, color = 'flame', isCurrency = false, link = null }: Props = $props();
	function handleClick() {
		if (link) {
			goto(link);
		}
	}
	function formatValue(value: number): string {
		if (isCurrency) {
			return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
		}
		return value.toString();
	}
</script>

{#if link}
	<button
		class="dashboard-card interactive"
		data-color={color}
		onclick={handleClick}
		aria-label="{title} - View details"
		data-component="DashboardCard"
		data-title={title}
	>
		<!-- Hover gradient overlay -->
		<div class="hover-overlay" data-color={color}></div>
		<div class="card-content">
			<div class="card-info">
				<p class="card-title">{title}</p>
				<p class="card-value" data-color={color}>{formatValue(value)}</p>
			</div>
			<div class="icon-container" data-color={color}>
				<Icon name={icon} size={28} extraClass="text-white" />
			</div>
		</div>
		<!-- Subtle arrow indicator -->
		<div class="arrow-indicator"><Icon name="arrow-right" size={16} /></div>
	</button>
{:else}
	<div
		class="dashboard-card"
		data-color={color}
		role="region"
		data-component="DashboardCard"
		data-title={title}
	>
		<div class="card-content">
			<div class="card-info">
				<p class="card-title">{title}</p>
				<p class="card-value" data-color={color}>{formatValue(value)}</p>
			</div>
			<div class="icon-container" data-color={color}>
				<Icon name={icon} size={28} extraClass="text-white" />
			</div>
		</div>
	</div>
{/if}

<style>
	.dashboard-card {
		position: relative;
		overflow: hidden;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		background: rgba(255, 255, 255, 0.8);
		border-radius: var(--radius-xl, 12px);
		border: 1px solid rgba(255, 255, 255, 0.5);
		padding: 1.5rem;
		width: 100%;
		box-shadow: var(--shadow-soft);
	}
	.dashboard-card[data-color='blue'] {
		background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
		border-color: rgba(191, 219, 254, 0.5);
	}
	.dashboard-card[data-color='green'] {
		background: linear-gradient(to bottom right, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05));
		border-color: rgba(187, 247, 208, 0.5);
	}
	.dashboard-card[data-color='amber'] {
		background: linear-gradient(to bottom right, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05));
		border-color: rgba(254, 215, 170, 0.5);
	}
	.dashboard-card[data-color='red'] {
		background: linear-gradient(to bottom right, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
		border-color: rgba(254, 202, 202, 0.5);
	}
	.dashboard-card[data-color='purple'] {
		background: linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.05));
		border-color: rgba(221, 214, 254, 0.5);
	}
	.dashboard-card[data-color='flame'] {
		background: linear-gradient(to bottom right, rgba(255, 87, 34, 0.1), rgba(230, 74, 25, 0.05));
		border-color: rgba(255, 171, 145, 0.5);
	}
	.dashboard-card[data-color='gold'] {
		background: linear-gradient(to bottom right, rgba(255, 193, 7, 0.1), rgba(255, 179, 0, 0.05));
		border-color: rgba(255, 224, 130, 0.5);
	}
	.dashboard-card[data-color='royal'] {
		background: linear-gradient(to bottom right, rgba(63, 81, 181, 0.1), rgba(48, 63, 159, 0.05));
		border-color: rgba(159, 168, 218, 0.5);
	}
	.dashboard-card[data-color='cyan'] {
		background: linear-gradient(to bottom right, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.05));
		border-color: rgba(165, 243, 252, 0.5);
	} /* Dark mode border colors */
	:global(.dark) .dashboard-card[data-color='blue'] {
		border-color: rgba(29, 78, 216, 0.5);
		background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.08));
	}
	:global(.dark) .dashboard-card[data-color='green'] {
		border-color: rgba(21, 128, 61, 0.5);
		background: linear-gradient(to bottom right, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.08));
	}
	:global(.dark) .dashboard-card[data-color='amber'] {
		border-color: rgba(180, 83, 9, 0.5);
		background: linear-gradient(to bottom right, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.08));
	}
	:global(.dark) .dashboard-card[data-color='red'] {
		border-color: rgba(185, 28, 28, 0.5);
		background: linear-gradient(to bottom right, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.08));
	}
	:global(.dark) .dashboard-card[data-color='purple'] {
		border-color: rgba(126, 34, 206, 0.5);
		background: linear-gradient(
			to bottom right,
			rgba(168, 85, 247, 0.15),
			rgba(147, 51, 234, 0.08)
		);
	}
	:global(.dark) .dashboard-card[data-color='flame'] {
		border-color: rgba(230, 74, 25, 0.5);
		background: linear-gradient(to bottom right, rgba(255, 87, 34, 0.15), rgba(230, 74, 25, 0.08));
	}
	:global(.dark) .dashboard-card[data-color='gold'] {
		border-color: rgba(255, 179, 0, 0.5);
		background: linear-gradient(to bottom right, rgba(255, 193, 7, 0.15), rgba(255, 179, 0, 0.08));
	}
	:global(.dark) .dashboard-card[data-color='royal'] {
		border-color: rgba(48, 63, 159, 0.5);
		background: linear-gradient(to bottom right, rgba(63, 81, 181, 0.15), rgba(48, 63, 159, 0.08));
	}
	:global(.dark) .dashboard-card[data-color='cyan'] {
		border-color: rgba(8, 145, 178, 0.5);
		background: linear-gradient(to bottom right, rgba(6, 182, 212, 0.15), rgba(8, 145, 178, 0.08));
	}
	.interactive {
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease-out;
	}
	.interactive:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-soft-lg);
	}
	.interactive:active {
		transform: translateY(0);
	}
	.hover-overlay {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 0.2s ease-out;
		pointer-events: none;
	}
	.hover-overlay[data-color='blue'] {
		background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
	}
	.hover-overlay[data-color='green'] {
		background: linear-gradient(to bottom right, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05));
	}
	.hover-overlay[data-color='amber'] {
		background: linear-gradient(to bottom right, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05));
	}
	.hover-overlay[data-color='red'] {
		background: linear-gradient(to bottom right, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
	}
	.hover-overlay[data-color='purple'] {
		background: linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.05));
	}
	.hover-overlay[data-color='flame'] {
		background: linear-gradient(to bottom right, rgba(255, 87, 34, 0.1), rgba(230, 74, 25, 0.05));
	}
	.hover-overlay[data-color='gold'] {
		background: linear-gradient(to bottom right, rgba(255, 193, 7, 0.1), rgba(255, 179, 0, 0.05));
	}
	.hover-overlay[data-color='royal'] {
		background: linear-gradient(to bottom right, rgba(63, 81, 181, 0.1), rgba(48, 63, 159, 0.05));
	}
	.hover-overlay[data-color='cyan'] {
		background: linear-gradient(to bottom right, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.05));
	}
	.interactive:hover .hover-overlay {
		opacity: 1;
	}
	.card-content {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.card-info {
		flex: 1;
	}
	.card-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-600);
		margin-bottom: 0.5rem;
	}
	:global(.dark) .card-title {
		color: var(--color-gray-400);
	}
	.card-value {
		font-size: 1.875rem;
		font-weight: 700;
		transition: color 0.2s ease-out;
	}
	.card-value[data-color='blue'] {
		color: var(--color-blue-700);
	}
	.card-value[data-color='green'] {
		color: var(--color-green-700);
	}
	.card-value[data-color='amber'] {
		color: var(--color-amber-700);
	}
	.card-value[data-color='red'] {
		color: var(--color-red-700);
	}
	.card-value[data-color='purple'] {
		color: var(--color-purple-700);
	}
	.card-value[data-color='flame'] {
		color: var(--color-flame-700);
	}
	.card-value[data-color='gold'] {
		color: var(--color-gold-700);
	}
	.card-value[data-color='royal'] {
		color: var(--color-royal-700);
	}
	.card-value[data-color='cyan'] {
		color: var(--color-cyan-700);
	}
	:global(.dark) .card-value[data-color='blue'] {
		color: var(--color-blue-400);
	}
	:global(.dark) .card-value[data-color='green'] {
		color: var(--color-green-400);
	}
	:global(.dark) .card-value[data-color='amber'] {
		color: var(--color-amber-400);
	}
	:global(.dark) .card-value[data-color='red'] {
		color: var(--color-red-400);
	}
	:global(.dark) .card-value[data-color='purple'] {
		color: var(--color-purple-400);
	}
	:global(.dark) .card-value[data-color='flame'] {
		color: var(--color-flame-400);
	}
	:global(.dark) .card-value[data-color='gold'] {
		color: var(--color-gold-400);
	}
	:global(.dark) .card-value[data-color='royal'] {
		color: var(--color-royal-400);
	}
	:global(.dark) .card-value[data-color='cyan'] {
		color: var(--color-cyan-400);
	}
	.interactive:hover .card-value {
		/* Subtle brightness increase instead of scaling */
		filter: brightness(1.1);
	}
	.icon-container {
		height: 3.5rem;
		width: 3.5rem;
		border-radius: var(--radius-2xl, 16px);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-lg);
		transition: transform 0.2s ease-out;
	}
	.icon-container[data-color='blue'] {
		background: linear-gradient(to bottom right, var(--color-blue-400), var(--color-blue-600));
	}
	.icon-container[data-color='green'] {
		background: linear-gradient(to bottom right, var(--color-green-400), var(--color-green-600));
	}
	.icon-container[data-color='amber'] {
		background: linear-gradient(to bottom right, var(--color-amber-400), var(--color-amber-600));
	}
	.icon-container[data-color='red'] {
		background: linear-gradient(to bottom right, var(--color-red-400), var(--color-red-600));
	}
	.icon-container[data-color='purple'] {
		background: linear-gradient(to bottom right, var(--color-purple-400), var(--color-purple-600));
	}
	.icon-container[data-color='flame'] {
		background: linear-gradient(to bottom right, var(--color-flame-400), var(--color-flame-600));
	}
	.icon-container[data-color='gold'] {
		background: linear-gradient(to bottom right, var(--color-gold-400), var(--color-gold-600));
	}
	.icon-container[data-color='royal'] {
		background: linear-gradient(to bottom right, var(--color-royal-400), var(--color-royal-600));
	}
	.icon-container[data-color='cyan'] {
		background: linear-gradient(to bottom right, var(--color-cyan-400), var(--color-cyan-600));
	}
	.interactive:hover .icon-container {
		transform: scale(1.02);
	}
	.arrow-indicator {
		position: absolute;
		bottom: 0.75rem;
		right: 0.75rem;
		opacity: 0;
		transition: opacity 0.2s ease-out;
	}
	.interactive:hover .arrow-indicator {
		opacity: 1;
	}
</style>
