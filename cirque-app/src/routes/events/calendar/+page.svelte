<!-- src/routes/events/calendar/+page.svelte -->
<script lang="ts">
	// Calendar view placeholder
	// This will be implemented in a future update
</script>

<svelte:head>
	<title>Calendar | Ringmaster</title>
</svelte:head>

<div class="page-container">
	<div class="page-header">
		<h1 class="page-title">Event Calendar</h1>
	</div>

	<div class="calendar-placeholder">
		<p class="placeholder-text">Calendar view coming soon!</p>
		<p class="placeholder-subtitle">
			View all your events in a calendar format to better manage scheduling.
		</p>
	</div>
</div>

<style>
	.page-container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 1.5rem;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-gray-900);
	}

	:global(.dark) .page-title {
		color: var(--color-gray-100);
	}

	.calendar-placeholder {
		background: white;
		border-radius: var(--radius-lg);
		padding: 4rem 2rem;
		text-align: center;
		box-shadow: var(--shadow-soft);
	}

	:global(.dark) .calendar-placeholder {
		background: var(--color-gray-800);
	}

	.placeholder-text {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-gray-700);
		margin-bottom: 0.5rem;
	}

	:global(.dark) .placeholder-text {
		color: var(--color-gray-300);
	}

	.placeholder-subtitle {
		color: var(--color-gray-500);
	}

	:global(.dark) .placeholder-subtitle {
		color: var(--color-gray-400);
	}
</style>
