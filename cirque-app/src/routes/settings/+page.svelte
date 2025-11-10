<!-- src/routes/settings/+page.svelte -->
<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
</script>

<div class="settings-page">
	<div class="settings-container">
		<div class="settings-header">
			<h1 class="settings-title">Settings</h1>
			<p class="settings-description">Manage your CircusSync preferences and configuration</p>
		</div>

		<div class="settings-content">
			<div class="placeholder-container">
				<div class="placeholder-icon">
					<Icon name="cog" size={48} />
				</div>
				<h3 class="placeholder-title">Settings Coming Soon</h3>
				<p class="placeholder-description">
					We're working on adding customization options to make CircusSync work even better for
					you. Check back soon for theme preferences, notification settings, and more.
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	.settings-page {
		min-height: 100%;
		padding: 1.5rem;
	}

	@media (min-width: 640px) {
		.settings-page {
			padding: 2rem;
		}
	}

	.settings-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.settings-header {
		margin-bottom: 2rem;
	}

	.settings-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin: 0 0 0.5rem 0;
	}

	.settings-description {
		font-size: 1rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.settings-content {
		background: white;
		border-radius: var(--radius-lg);
		padding: 3rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 400px;
	}

	:global(.dark) .settings-content {
		background: var(--color-gray-800);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	.placeholder-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: 420px;
		gap: 1rem;
	}

	.placeholder-icon {
		width: 6rem;
		height: 6rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(249, 115, 22, 0.1);
		color: var(--color-flame-500);
		margin-bottom: 0.5rem;
	}

	:global(.dark) .placeholder-icon {
		background: rgba(249, 115, 22, 0.2);
	}

	.placeholder-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
	}

	.placeholder-description {
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
		margin: 0;
	}
</style>
