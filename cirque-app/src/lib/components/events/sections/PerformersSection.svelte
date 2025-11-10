<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import type { Performer } from '$lib/types';
	import Select from 'svelte-select';

	interface Props {
		formData: any;
		performers: any; // This is the performers store
	}

	let { formData = $bindable(), performers }: Props = $props();

	const selectedPerformer: string | null = $state(null);

	let performerRole = $state('');

	let performerPay = $state(0);

	// Format performers for svelte-select
	const performerOptions = $derived(performers.map((p) => ({ value: p.id, label: p.name })));

	// Keep track of selected performers in the dropdown
	let selectedPerformersForDropdown: { value: string; label: string }[] = $state([]);

	// Function to add selected performers to the event
	function addSelectedPerformers() {
		const currentPerformerIds = new Set(formData.performers.map((p: any) => p.id));

		const performersToAdd = selectedPerformersForDropdown
			.filter((selected) => !currentPerformerIds.has(selected.value))
			.map((selected) => performers.find((p) => p.id === selected.value))
			.filter(Boolean); // Filter out any undefined results

		if (performersToAdd.length > 0) {
			// Add only necessary info (id, name) to formData.performers
			formData.performers = [
				...formData.performers,
				...performersToAdd.map((p: any) => ({
					id: p.id,
					name: p.name
				})) // Store minimal info
			];
		}

		// Clear the dropdown selection after adding (optional, depends on desired UX)
		// selectedPerformersForDropdown = [];
	}

	// Function to remove a performer from the event
	function removePerformer(performerId: string) {
		formData.performers = formData.performers.filter((p: any) => p.id !== performerId);
	}

	// Update dropdown selection when formData or performerOptions change
	$effect(() => {
		selectedPerformersForDropdown = formData.performers
			? formData.performers
					.map((p: any) => performerOptions.find((opt) => opt.value === p.id))
					.filter(Boolean)
			: [];
	});

	// Get performer name by ID
	function getPerformerName(performerId: string) {
		const performer = performers.find((p: Performer) => p.id === performerId);
		return performer ? performer.name : 'Unknown';
	}
</script>

<div class="performers-container" data-component="PerformersSection">
	<h3 class="performers-title">Performers</h3>

	<!-- Selected Performers -->
	{#if formData.performers.length === 0}
		<div class="empty-state-wrapper">
			<EmptyState
				icon="users"
				title="No performers assigned"
				description="Add performers to this event using the form below"
			/>
		</div>
	{:else}
		<div class="glass performers-table">
			<div class="table-wrapper">
				<table class="performers-data-table">
					<thead class="table-head">
						<tr>
							<th scope="col" class="table-header-cell">Name</th>
							<th scope="col" class="table-header-cell">Role</th>
							<th scope="col" class="table-header-cell">Pay</th>
							<th scope="col" class="table-header-cell">Status</th>
							<th scope="col" class="table-header-cell">Actions</th>
						</tr>
					</thead>
					<tbody class="table-body">
						{#each formData.performers as performer, i}
							<tr
								class="table-row-hover animate-fade-in"
								style="animation-delay: {i * 50}ms"
							>
								<td class="table-cell performer-name">
									{performer.displayName || getPerformerName(performer.performer)}
								</td>
								<td class="table-cell performer-role">
									{performer.role || '-'}
								</td>
								<td class="table-cell performer-pay">
									${performer.pay.toLocaleString()}
								</td>
								<td class="table-cell performer-status">
									{#if performer.confirmed}
										<Badge variant="secondary" color="green" size="md">
											{#snippet children()}
												Confirmed
											{/snippet}
										</Badge>
									{:else}
										<Badge variant="secondary" color="amber" size="md">
											{#snippet children()}
												Pending
											{/snippet}
										</Badge>
									{/if}
								</td>
								<td class="table-cell">
									<button
										type="button"
										class="remove-performer-button"
										onclick={() => removePerformer(performer.performer)}
									>
										<Icon name="trash-2" size={16} />
										Remove
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

	<!-- Add Performer Form -->
	<div class="glass add-performer-form">
		<div class="form-header">
			<div class="header-icon">
				<Icon name="user-plus" size={18} extraClass="text-white" />
			</div>
			<h4 class="form-title">Add Performer</h4>
		</div>

		<div class="form-grid">
			<!-- Performer Select -->
			<div class="input-group">
				<label for="performers" class="form-label">Select Performer</label>
				<Select
					id="performers"
					multiple={true}
					items={performerOptions}
					bind:value={selectedPerformersForDropdown}
					placeholder="Search and select performers..."
					on:select={addSelectedPerformers}
					--item-font-size="0.875rem"
					--multi-item-font-size="0.875rem"
					--border-radius="0.5rem"
					--border-focused="2px solid rgb(249 115 22)"
				/>
				<a href="/performers/new" target="_blank" class="add-new-link">
					<Icon name="plus-circle" size={14} />
					Add New Performer
				</a>
			</div>

			<!-- Role -->
			<div class="input-group">
				<label for="performerRole" class="form-label">Role / Act</label>
				<input
					type="text"
					id="performerRole"
					bind:value={performerRole}
					class="form-input input-focus"
					placeholder="e.g. Lead Fire Dancer"
				/>
			</div>

			<!-- Pay -->
			<div class="input-group">
				<label for="performerPay" class="form-label">Pay Amount</label>
				<div class="currency-input-wrapper">
					<span class="currency-symbol">$</span>
					<input
						type="number"
						id="performerPay"
						bind:value={performerPay}
						min="0"
						step="0.01"
						class="form-input input-focus currency-input"
						placeholder="0.00"
					/>
				</div>
			</div>
		</div>

		<div class="form-actions">
			<Button
				type="button"
				variant="secondary"
				color="flame"
				onclick={addSelectedPerformers}
				disabled={!selectedPerformersForDropdown.length}
				size="md"
			>
				{#snippet children()}
					<Icon name="plus" size={18} extraClass="mr-2" />
					Add Performer
				{/snippet}
			</Button>
		</div>
	</div>
</div> <style>
	.performers-container { padding: 0; }

	.performers-title { font-size: 1.5rem; font-weight: 700; color: var(--color-gray-900); margin-bottom: 1.5rem; }

	:global(.dark) .performers-title { color: var(--color-gray-100); }

	.empty-state-wrapper { margin-bottom: 1.5rem; }

	.performers-table { border-radius: var(--radius-xl); overflow: hidden; margin-bottom: 1.5rem; border: 1px solid rgba(229, 231, 235, 0.5); box-shadow: var(--shadow-soft); }

	:global(.dark) .performers-table { border-color: rgba(75, 85, 99, 0.5); }

	.table-wrapper { overflow-x: auto; }

	.performers-data-table { min-width: 100%; border-collapse: collapse; }

	.table-head { background: linear-gradient(to right, rgba(249, 115, 22, 0.05), rgba(168, 85, 247, 0.05)); }

	:global(.dark) .table-head { background: linear-gradient(to right, rgba(249, 115, 22, 0.1), rgba(168, 85, 247, 0.1)); }

	.table-header-cell { padding: 1rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 700; color: var(--color-gray-700); text-transform: uppercase; letter-spacing: 0.05em; }

	:global(.dark) .table-header-cell { color: var(--color-gray-300); }

	.table-header-cell.text-right { text-align: right; }

	.table-body { background: transparent; }

	.table-body tr { border-top: 1px solid rgba(229, 231, 235, 0.5); }

	:global(.dark) .table-body tr { border-top-color: rgba(75, 85, 99, 0.5); }

	.table-cell { padding: 1rem 1.5rem; white-space: nowrap; font-size: 0.875rem; }

	.table-cell.text-right { text-align: right; }

	.performer-name { font-weight: 600; color: var(--color-gray-900); }

	:global(.dark) .performer-name { color: var(--color-gray-100); }

	.performer-role { color: var(--color-gray-600); }

	:global(.dark) .performer-role { color: var(--color-gray-400); }

	.performer-pay { font-weight: 500; color: var(--color-gray-900); }

	:global(.dark) .performer-pay { color: var(--color-gray-100); }

	.remove-performer-button { display: inline-flex; align-items: center; gap: 0.25rem; color: var(--color-red-600); background: transparent; border: none; cursor: pointer; font-weight: 600; transition: all var(--transition-base); }

	.remove-performer-button:hover { color: var(--color-red-800); transform: scale(1.1); }

	.remove-performer-button:active { transform: scale(0.95); }

	:global(.dark) .remove-performer-button { color: var(--color-red-400); }

	:global(.dark) .remove-performer-button:hover { color: var(--color-red-300); }

	.add-performer-form { padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid rgba(229, 231, 235, 0.5); box-shadow: var(--shadow-soft); }

	:global(.dark) .add-performer-form { border-color: rgba(75, 85, 99, 0.5); }

	.form-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; }

	.header-icon { height: 2rem; width: 2rem; border-radius: var(--radius-lg); background: linear-gradient(to bottom right, var(--color-flame-500), var(--color-flame-600)); display: flex; align-items: center; justify-content: center; }

	.form-title { font-size: 1.125rem; font-weight: 700; color: var(--color-gray-900); }

	:global(.dark) .form-title { color: var(--color-gray-100); }

	.form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }

	@media (min-width: 768px) { .form-grid { grid-template-columns: repeat(3, 1fr); } }

	.input-group { display: flex; flex-direction: column; }

	.add-new-link { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; color: var(--color-flame-600); font-weight: 500; margin-top: 0.5rem; transition: all var(--transition-base); }

	.add-new-link:hover { color: var(--color-flame-700); }

	:global(.dark) .add-new-link { color: var(--color-flame-400); }

	:global(.dark) .add-new-link:hover { color: var(--color-flame-300); }

	.currency-input-wrapper { position: relative; display: flex; align-items: center; }

	.currency-symbol { position: absolute; left: 1rem; color: var(--color-gray-500); font-weight: 500; pointer-events: none; }

	:global(.dark) .currency-symbol { color: var(--color-gray-400); }

	.currency-input { padding-left: 2rem; }

	.form-actions { margin-top: 1.5rem; display: flex; justify-content: flex-end; }

</style>
