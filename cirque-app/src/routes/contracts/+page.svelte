<script lang="ts">
	import ContractsPage from '$lib/components/contracts/+page.svelte';
	const { data } = $props<{ data: any }>();
</script>

<ContractsPage
	page={{
		url: {
			searchParams: new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
		}
	}}
/>
