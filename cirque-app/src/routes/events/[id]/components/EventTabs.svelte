<!-- src/routes/events/[id]/components/EventTabs.svelte -->
<script lang="ts">
	import Tab from '$lib/components/ui/Tab.svelte';
	interface Props {
		activeTab?: string;
		ontabchange?: (tab: string) => void;
	}
	const { activeTab = 'details', ontabchange }: Props = $props();
	function handleTabChange(tab: string) {
		ontabchange?.(tab);
	}
</script>

<div class="event-tabs" data-component="EventTabs">
	<div class="tabs-container">
		<div class="tabs-wrapper">
			<Tab
				label="Details"
				active={activeTab === 'details'}
				onclick={() => handleTabChange('details')}
			/>
			<Tab
				label="Performers"
				active={activeTab === 'performers'}
				onclick={() => handleTabChange('performers')}
			/>
			<Tab
				label="Client Info"
				active={activeTab === 'client'}
				onclick={() => handleTabChange('client')}
			/>
			<Tab
				label="Contract & Payment"
				active={activeTab === 'contract'}
				onclick={() => handleTabChange('contract')}
			/>
			<Tab label="Notes" active={activeTab === 'notes'} onclick={() => handleTabChange('notes')} />
		</div>
	</div>
</div>

<style>
	.event-tabs {
		background: var(--surface-color);
		border-bottom: 1px solid var(--border-color);
	}
	.tabs-container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1rem;
	}
	.tabs-wrapper {
		display: flex;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.tabs-wrapper::-webkit-scrollbar {
		display: none;
	}
	:global(.dark) .event-tabs {
		background: var(--surface-color-dark);
		border-color: var(--border-color-dark);
	}
</style>
