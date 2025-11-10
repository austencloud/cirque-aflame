<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface Props {
		formData: any;
	}

	let { formData = $bindable() }: Props = $props();
	let newEquipment = $state('');

	// Add equipment
	function addEquipment() {
		if (!newEquipment) {
			return;
		}
		if (!formData.equipmentNeeded.includes(newEquipment)) {
			formData.equipmentNeeded = [...formData.equipmentNeeded, newEquipment];
			newEquipment = '';
		}
	}

	// Remove equipment
	function removeEquipment(item: string) {
		formData.equipmentNeeded = formData.equipmentNeeded.filter((e: string) => e !== item);
	}
</script>

<div class="equipment-container" data-component="EquipmentSection">
	<h4 class="equipment-title">Equipment Needed</h4>
	
	<!-- Equipment List -->
	<div class="equipment-list">
		{#if formData.equipmentNeeded.length === 0}
			<p class="empty-state">No equipment added</p>
		{:else}
			<ul class="items-list">
				{#each formData.equipmentNeeded as item}
					<li class="equipment-item">
						<span class="item-name">{item}</span>
						<button
							type="button"
							class="remove-button"
							onclick={() => removeEquipment(item)}
						>
							<Icon name="x" size={16} />
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
	
	<!-- Add Equipment -->
	<div class="add-equipment-form">
		<input
			type="text"
			placeholder="Add equipment item"
			bind:value={newEquipment}
			class="form-input equipment-input"
		/>
		<button type="button" class="add-button" onclick={addEquipment}>
			Add
		</button>
	</div>
</div>

<style>
	.equipment-container {
		margin-top: 1.5rem;
	}
	.equipment-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-700);
		margin-bottom: 0.75rem;
	}
	:global(.dark) .equipment-title {
		color: var(--color-gray-300);
	}
	.equipment-list {
		margin-bottom: 0.75rem;
	}
	.empty-state {
		color: var(--color-gray-500);
		font-size: 0.875rem;
		font-style: italic;
	}
	:global(.dark) .empty-state {
		color: var(--color-gray-400);
	}
	.items-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		list-style: none;
	}
	.equipment-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--color-gray-50);
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-md);
		transition: all var(--transition-base);
	}
	.equipment-item:hover {
		background: var(--color-gray-100);
	}
	:global(.dark) .equipment-item {
		background: var(--color-gray-800);
	}
	:global(.dark) .equipment-item:hover {
		background: var(--color-gray-700);
	}
	.item-name {
		font-size: 0.875rem;
		color: var(--color-gray-900);
	}
	:global(.dark) .item-name {
		color: var(--color-gray-100);
	}
	.remove-button {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-red-600);
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: var(--radius-sm);
		transition: all var(--transition-base);
	}
	.remove-button:hover {
		color: var(--color-red-700);
		background: var(--color-red-50);
	}
	:global(.dark) .remove-button {
		color: var(--color-red-400);
	}
	:global(.dark) .remove-button:hover {
		color: var(--color-red-300);
		background: rgba(239, 68, 68, 0.1);
	}
	.add-equipment-form {
		display: flex;
		gap: 0;
	}
	.equipment-input {
		flex: 1;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		border-right: none;
	}
	.add-button {
		padding: 0.625rem 1rem;
		background: var(--color-flame-600);
		color: white;
		border: none;
		border-top-right-radius: var(--radius-md);
		border-bottom-right-radius: var(--radius-md);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--transition-base);
	}
	.add-button:hover {
		background: var(--color-flame-700);
	}
	.add-button:focus {
		outline: none;
		box-shadow: var(--shadow-glow-sm);
	}
	:global(.dark) .add-button {
		background: var(--color-flame-500);
	}
	:global(.dark) .add-button:hover {
		background: var(--color-flame-600);
	}
</style>
