<script lang="ts">
	import TasksPage from '$lib/components/tasks/+page.svelte';
	const { data } = $props<{ data: any }>();
</script>

<TasksPage
	page={{
		url: {
			searchParams: new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
		}
	}}
/>
