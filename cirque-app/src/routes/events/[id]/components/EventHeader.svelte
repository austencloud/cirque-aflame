<!-- src/routes/events/[id]/components/EventHeader.svelte -->
<script lang="ts">
	import { format } from 'date-fns';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	interface Props {
		event?: any;
		canEdit?: boolean;
		onedit?: () => void;
		ondelete?: () => void;
		onstatuschange?: (newStatus: string) => void;
	}

	const { event, canEdit = false, onedit, ondelete, onstatuschange }: Props = $props();

	// Helper functions
	function getStatusColor(
		status: string
	): 'blue' | 'green' | 'red' | 'amber' | 'gray' | 'purple' | undefined {
		switch (status) {
			case 'confirmed':
				return 'green';
			case 'deposit-received':
				return 'blue';
			case 'inquiry':
				return 'gray';
			case 'completed':
				return 'purple';
			case 'cancelled':
				return 'red';
			default:
				return 'gray';
		}
	}

	function getStatusText(status: string): string {
		switch (status) {
			case 'deposit-received':
				return 'Deposit Received';
			default:
				return status.charAt(0).toUpperCase() + status.slice(1);
		}
	}

	function handleEdit() {
		onedit?.();
	}

	function handleDelete() {
		ondelete?.();
	}

	function handleStatusChange(newStatus: string) {
		onstatuschange?.(newStatus);
	}
</script>

<div class="event-header" data-component="EventHeader"> <div class="header-container"> <div class="header-content"> <!-- Event Title and Basic Info --> <div class="event-info"> <div class="title-row"> <h1 class="event-title">{event.name}</h1> <Badge color={getStatusColor(event.status)}> {#snippet children()}{getStatusText(event.status)}{/snippet} </Badge> </div> <div class="meta-info"> <div class="meta-item"> <Icon name="calendar" size={16} extraClass="meta-icon" /> {format(event.date, 'EEEE, MMMM d, yyyy')} </div> <div class="meta-item"> <Icon name="clock" size={16} extraClass="meta-icon" /> Performance: {event.performanceTime.start} - {event.performanceTime.end} </div> <div class="meta-item"> <Icon name="users" size={16} extraClass="meta-icon" /> {event.performers?.length || 0} performer{(event.performers?.length || 0) !== 1 ? 's' : ''} </div> </div> </div> <!-- Action Buttons --> {#if canEdit} <div class="action-buttons"> <Button variant="outline" onclick={handleEdit}> {#snippet children()} <Icon name="edit" size={16} extraClass="mr-1" /> Edit Event {/snippet} </Button> <Button variant="outline" color="red" onclick={handleDelete}> {#snippet children()} <Icon name="trash-2" size={16} extraClass="mr-1" /> Delete {/snippet} </Button> <div class="actions-dropdown"> <Button> {#snippet children()} <Icon name="more-horizontal" size={16} /> Actions {/snippet} </Button> <div class="dropdown-menu"> <div class="dropdown-content"> {#if event.status !== 'confirmed'} <button class="dropdown-item" onclick={() => handleStatusChange('confirmed')} > Mark as Confirmed </button> {/if} {#if event.status !== 'deposit-received' && event.deposit.required && !event.deposit.received} <button class="dropdown-item" onclick={() => handleStatusChange('deposit-received')} > Mark Deposit Received </button> {/if} {#if event.status !== 'completed'} <button class="dropdown-item" onclick={() => handleStatusChange('completed')} > Mark as Completed </button> {/if} {#if event.status !== 'cancelled'} <button class="dropdown-item danger" onclick={() => handleStatusChange('cancelled')} > Mark as Cancelled </button> {/if} <a href={`/events/${event.id}/contract`} class="dropdown-item" > Generate Contract </a> </div> </div> </div> </div> {/if} </div> </div>
</div> <style>
	.event-header { background: var(--surface-color); border-bottom: 1px solid var(--border-color); }

	.header-container { max-width: 80rem; margin: 0 auto; padding: 1rem 1rem; }

	@media (min-width: 768px) { .header-container { padding: 1.5rem 1.5rem; } }

	.header-content { display: flex; flex-direction: column; gap: 1rem; }

	@media (min-width: 768px) { .header-content { flex-direction: row; align-items: center; justify-content: space-between; } }

	.event-info { flex: 1; }

	.title-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

	.event-title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }

	.meta-info { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-secondary); }

	.meta-item { display: flex; align-items: center; gap: 0.25rem; }

	:global(.meta-icon) { margin-right: 0.25rem; }

	.action-buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; }

	.actions-dropdown { position: relative; }

	.dropdown-menu { position: absolute; right: 0; margin-top: 0.5rem; width: 12rem; background: var(--surface-color); border-radius: var(--border-radius); box-shadow: var(--shadow-lg); z-index: 10; display: none; }

	.actions-dropdown:hover .dropdown-menu { display: block; }

	.dropdown-content { padding: 0.25rem 0; }

	.dropdown-item { display: block; width: 100%; text-align: left; padding: 0.5rem 1rem; font-size: 0.875rem; color: var(--text-primary); background: none; border: none; cursor: pointer; transition: background-color 0.2s; text-decoration: none; }

	.dropdown-item:hover { background: var(--surface-hover); }

	.dropdown-item.danger { color: var(--error-color); }

	:global(.dark) .event-header { background: var(--surface-color-dark); border-color: var(--border-color-dark); }

	:global(.dark) .event-title { color: var(--text-primary-dark); }

	:global(.dark) .meta-info { color: var(--text-secondary-dark); }

	:global(.dark) .dropdown-menu { background: var(--surface-color-dark); }

	:global(.dark) .dropdown-item { color: var(--text-primary-dark); }

	:global(.dark) .dropdown-item:hover { background: var(--surface-hover-dark); }

	:global(.dark) .dropdown-item.danger { color: var(--error-color); }

</style>
