<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface Props {
		formData: any;
		serviceOptions: string[];
	}

	let { formData = $bindable(), serviceOptions }: Props = $props();
	let newService = $state('');

	// Add service
	function addService() {
		if (!newService) {
			return;
		}
		if (!formData.services.includes(newService)) {
			formData.services = [...formData.services, newService];
			newService = '';
		}
	}

	// Remove service
	function removeService(service: string) {
		formData.services = formData.services.filter((s: string) => s !== service);
	}

	// Toggle service from predefined list
	function toggleService(service: string) {
		if (formData.services.includes(service)) {
			formData.services = formData.services.filter((s: string) => s !== service);
		} else {
			formData.services = [...formData.services, service];
		}
	}
</script>

<div class="services-container" data-component="ServicesSection">
	<h4 class="services-title">Services</h4>
	
	<!-- Selected Services -->
	<div class="selected-services">
		{#each formData.services as service}
			<div class="service-badge">
				{service}
				<button
					type="button"
					class="remove-service-button"
					onclick={() => removeService(service)}
				>
					<Icon name="x" size={16} />
				</button>
			</div>
		{/each}
		{#if formData.services.length === 0}
			<p class="empty-state">No services selected</p>
		{/if}
	</div>
	
	<!-- Common Services -->
	<div class="common-services-section">
		<p class="section-label">Common Services:</p>
		<div class="service-options">
			{#each serviceOptions as option}
				<button
					type="button"
					class="service-option-button"
					class:active={formData.services.includes(option)}
					onclick={() => toggleService(option)}
				>
					{option}
				</button>
			{/each}
		</div>
	</div>
	
	<!-- Add Custom Service -->
	<div class="add-service-form">
		<input
			type="text"
			placeholder="Add custom service"
			bind:value={newService}
			class="form-input service-input"
		/>
		<button type="button" class="add-button" onclick={addService}>
			Add
		</button>
	</div>
</div>

<style>
	.services-container {
		margin-top: 1.5rem;
	}
	.services-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-700);
		margin-bottom: 0.75rem;
	}
	:global(.dark) .services-title {
		color: var(--color-gray-300);
	}
	.selected-services {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		min-height: 2rem;
	}
	.service-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background: var(--color-flame-100);
		color: var(--color-flame-800);
		border-radius: var(--radius-full);
		padding: 0.25rem 0.75rem;
		font-size: 0.875rem;
		transition: all var(--transition-base);
	}
	:global(.dark) .service-badge {
		background: rgba(249, 115, 22, 0.2);
		color: var(--color-flame-300);
	}
	.remove-service-button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 0.25rem;
		color: var(--color-flame-600);
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: all var(--transition-base);
	}
	.remove-service-button:hover {
		color: var(--color-flame-800);
	}
	:global(.dark) .remove-service-button {
		color: var(--color-flame-400);
	}
	:global(.dark) .remove-service-button:hover {
		color: var(--color-flame-200);
	}
	.empty-state {
		color: var(--color-gray-500);
		font-size: 0.875rem;
		font-style: italic;
	}
	:global(.dark) .empty-state {
		color: var(--color-gray-400);
	}
	.common-services-section {
		margin-bottom: 0.75rem;
	}
	.section-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-700);
		margin-bottom: 0.5rem;
	}
	:global(.dark) .section-label {
		color: var(--color-gray-300);
	}
	.service-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.service-option-button {
		padding: 0.25rem 0.75rem;
		font-size: 0.875rem;
		border-radius: var(--radius-full);
		background: var(--color-gray-100);
		color: var(--color-gray-800);
		border: 1px solid transparent;
		cursor: pointer;
		transition: all var(--transition-base);
	}
	.service-option-button:hover {
		background: var(--color-gray-200);
	}
	.service-option-button.active {
		background: var(--color-flame-500);
		color: white;
	}
	:global(.dark) .service-option-button {
		background: var(--color-gray-700);
		color: var(--color-gray-200);
	}
	:global(.dark) .service-option-button:hover {
		background: var(--color-gray-600);
	}
	:global(.dark) .service-option-button.active {
		background: var(--color-flame-500);
		color: white;
	}
	.add-service-form {
		display: flex;
		gap: 0;
	}
	.service-input {
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
