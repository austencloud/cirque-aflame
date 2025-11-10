<script lang="ts">
	import ClientDetailPage from '$lib/components/clients/[id]/+page.svelte';
	const { data } = $props<{ data: any }>();

	// Extract client ID from URL
	const clientId =
		typeof window !== 'undefined' ? window.location.pathname.split('/').pop() || '' : '';
</script>

<ClientDetailPage {clientId} />
