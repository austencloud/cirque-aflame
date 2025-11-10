<script lang="ts">
	import AgentDetailPage from '$lib/components/agents/[id]/+page.svelte';
	const { data } = $props<{ data: any }>();
	// Extract agent ID from URL
	const agentId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() || '' : '';
</script>

<AgentDetailPage {agentId} />
