<script lang="ts">
	import AgentsPage from '$lib/components/agents/+page.svelte';
	const { data } = $props<{ data: any }>();
</script>

<AgentsPage
	page={{
		url: {
			searchParams: new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
		}
	}}
/>
