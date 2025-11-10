<script lang="ts">
	import ClientsPage from '$lib/components/clients/ClientsPage.svelte';
	const { data } = $props<{ data: any }>();
</script>

<ClientsPage
	page={{
		url: {
			searchParams: new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
		}
	}}
/>
