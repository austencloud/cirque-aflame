<!-- src/lib/components/clients/ClientForm.svelte -->
<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { Client } from '$lib/types';
	import Icon from '$lib/components/ui/Icon.svelte';

	interface Props {
		client?: Partial<Client>;
		submitLabel?: string;
		isLoading?: boolean;
		showCancelButton?: boolean;
		onsubmit?: (data: Partial<Client>) => void;
		oncancel?: () => void;
	}

	const {
		client = {},
		submitLabel = 'Save Client',
		isLoading = false,
		showCancelButton = true,
		onsubmit,
		oncancel
	}: Props = $props();

	// Form state - must use $state for bind:value to work in Svelte 5
	let formData = $state({
		name: client.name || '',
		contactPerson: client.contactPerson || '',
		email: client.email || '',
		phone: client.phone || '',
		address: client.address || '',
		eventTypes: client.eventTypes || [],
		servicesUsed: client.servicesUsed || [],
		status: client.status || 'lead',
		notes: client.notes || ''
	});

	// New fields for event types and services
	let newEventType = $state('');
	let newService = $state('');

	// Options for event types and services
	const eventTypeOptions = [
		'Corporate Event',
		'Festival',
		'Wedding',
		'Birthday Party',
		'Holiday Event',
		'School Event',
		'Convention',
		'Trade Show',
		'Religious Event',
		'Non-profit Fundraiser'
	];

	const serviceOptions = [
		'Fire Performance',
		'Juggling',
		'Stilt Walking',
		'Aerial Performance',
		'Balloon Art',
		'Magic',
		'LED Performance',
		'Ambient Entertainment',
		'Choreographed Show',
		'Interactive Workshop'
	];

	// Handle form submission
	function handleSubmit() {
		// Validate form fields
		if (!formData.name) {
			alert('Client name is required');
			return;
		}
		onsubmit?.(formData);
	}

	// Handle cancel button
	function handleCancel() {
		oncancel?.();
	}

	// Add new event type
	function addEventType() {
		if (newEventType && !formData.eventTypes.includes(newEventType)) {
			formData.eventTypes = [...formData.eventTypes, newEventType];
			newEventType = '';
		}
	}

	// Remove event type
	function removeEventType(eventType: string) {
		formData.eventTypes = formData.eventTypes.filter((t: string) => t !== eventType);
	}

	// Add new service
	function addService() {
		if (newService && !formData.servicesUsed.includes(newService)) {
			formData.servicesUsed = [...formData.servicesUsed, newService];
			newService = '';
		}
	}

	// Remove service
	function removeService(service: string) {
		formData.servicesUsed = formData.servicesUsed.filter((s: string) => s !== service);
	}

	// Toggle event type from predefined options
	function toggleEventType(eventType: string) {
		if (formData.eventTypes.includes(eventType)) {
			removeEventType(eventType);
		} else {
			formData.eventTypes = [...formData.eventTypes, eventType];
		}
	}

	// Toggle service from predefined options
	function toggleService(service: string) {
		if (formData.servicesUsed.includes(service)) {
			removeService(service);
		} else {
			formData.servicesUsed = [...formData.servicesUsed, service];
		}
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
	class="client-form"
	data-component="ClientForm"
>
	<!-- Basic Information Section -->
	<div class="form-section">
		<h3 class="section-title">Basic Information</h3>
		<div class="form-grid">
			<!-- Client Name -->
			<div class="form-field">
				<label for="name" class="form-label"> Client Name * </label>
				<input type="text" id="name" bind:value={formData.name} class="form-input" required />
			</div>

			<!-- Contact Person -->
			<div class="form-field">
				<label for="contactPerson" class="form-label"> Contact Person </label>
				<input
					type="text"
					id="contactPerson"
					bind:value={formData.contactPerson}
					class="form-input"
				/>
			</div>

			<!-- Email -->
			<div class="form-field">
				<label for="email" class="form-label"> Email Address </label>
				<input type="email" id="email" bind:value={formData.email} class="form-input" />
			</div>

			<!-- Phone -->
			<div class="form-field">
				<label for="phone" class="form-label"> Phone Number </label>
				<input type="tel" id="phone" bind:value={formData.phone} class="form-input" />
			</div>

			<!-- Address -->
			<div class="form-field form-field-full">
				<label for="address" class="form-label"> Address </label>
				<textarea
					id="address"
					bind:value={formData.address}
					rows="2"
					class="form-input"
				></textarea>
			</div>
		</div>
	</div>

	<!-- Client Status -->
	<div class="form-section">
		<label for="status" class="form-label"> Client Status </label>
		<select id="status" bind:value={formData.status} class="form-input">
			<option value="lead">Lead</option>
			<option value="active">Active</option>
			<option value="inactive">Inactive</option>
			<option value="yearly">Yearly</option>
		</select>
	</div>

	<!-- Event Types Section -->
	<div class="form-section">
		<h3 class="section-title">Event Types</h3>

		<!-- Selected Event Types -->
		<div class="tag-list">
			{#each formData.eventTypes as eventType}
				<div class="tag tag-event-type">
					{eventType}
					<button type="button" class="tag-remove" onclick={() => removeEventType(eventType)}>
						<Icon name="x" size={16} />
					</button>
				</div>
			{/each}
			{#if formData.eventTypes.length === 0}
				<p class="empty-message">No event types selected</p>
			{/if}
		</div>

		<!-- Common Event Types -->
		<div class="options-section">
			<p class="options-label">Common Event Types:</p>
			<div class="option-buttons">
				{#each eventTypeOptions as option}
					<button
						type="button"
						class="option-button"
						class:selected={formData.eventTypes.includes(option)}
						onclick={() => toggleEventType(option)}
					>
						{option}
					</button>
				{/each}
			</div>
		</div>

		<!-- Add Custom Event Type -->
		<div class="input-group">
			<input
				type="text"
				placeholder="Add custom event type"
				bind:value={newEventType}
				class="form-input input-group-field"
			/>
			<button type="button" class="input-group-button button-event-type" onclick={addEventType}>
				Add
			</button>
		</div>
	</div>

	<!-- Services Used Section -->
	<div class="form-section">
		<h3 class="section-title">Services Used</h3>

		<!-- Selected Services -->
		<div class="tag-list">
			{#each formData.servicesUsed as service}
				<div class="tag tag-service">
					{service}
					<button type="button" class="tag-remove" onclick={() => removeService(service)}>
						<Icon name="x" size={16} />
					</button>
				</div>
			{/each}
			{#if formData.servicesUsed.length === 0}
				<p class="empty-message">No services selected</p>
			{/if}
		</div>

		<!-- Common Services -->
		<div class="options-section">
			<p class="options-label">Available Services:</p>
			<div class="option-buttons">
				{#each serviceOptions as option}
					<button
						type="button"
						class="option-button option-button-service"
						class:selected={formData.servicesUsed.includes(option)}
						onclick={() => toggleService(option)}
					>
						{option}
					</button>
				{/each}
			</div>
		</div>

		<!-- Add Custom Service -->
		<div class="input-group">
			<input
				type="text"
				placeholder="Add custom service"
				bind:value={newService}
				class="form-input input-group-field"
			/>
			<button type="button" class="input-group-button button-service" onclick={addService}>
				Add
			</button>
		</div>
	</div>

	<!-- Notes Section -->
	<div class="form-section">
		<h3 class="section-title">Notes</h3>
		<textarea
			bind:value={formData.notes}
			rows="4"
			class="form-input"
			placeholder="Add any notes about this client..."
		></textarea>
	</div>

	<!-- Form Actions -->
	<div class="form-actions">
		{#if showCancelButton}
			<Button type="button" variant="outline" color="gray" onclick={handleCancel} disabled={isLoading}>
				{#snippet children()}Cancel{/snippet}
			</Button>
		{/if}
		<Button type="submit" loading={isLoading} disabled={isLoading}>
			{#snippet children()}{submitLabel}{/snippet}
		</Button>
	</div>
</form>

<style>
	.client-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-title {
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-text-primary, #111827);
		margin-bottom: 0.5rem;
	}

	:global(.dark) .section-title {
		color: var(--color-text-primary-dark, #f9fafb);
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.form-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.form-field {
		display: flex;
		flex-direction: column;
	}

	.form-field-full {
		grid-column: 1 / -1;
	}

	.form-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary, #374151);
		margin-bottom: 0.25rem;
	}

	:global(.dark) .form-label {
		color: var(--color-text-secondary-dark, #d1d5db);
	}

	.form-input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border, #d1d5db);
		border-radius: 0.375rem;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		font-size: 0.875rem;
		line-height: 1.5;
		background-color: var(--color-bg-primary, #ffffff);
		color: var(--color-text-primary, #111827);
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary, #3b82f6);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	:global(.dark) .form-input {
		background-color: var(--color-bg-secondary-dark, #374151);
		border-color: var(--color-border-dark, #4b5563);
		color: var(--color-text-primary-dark, #f9fafb);
	}

	:global(.dark) .form-input:focus {
		border-color: var(--color-primary-dark, #60a5fa);
		box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 500;
		gap: 0.25rem;
	}

	.tag-event-type {
		background-color: #dbeafe;
		color: #1e40af;
	}

	:global(.dark) .tag-event-type {
		background-color: #1e3a8a;
		color: #bfdbfe;
	}

	.tag-service {
		background-color: #d1fae5;
		color: #065f46;
	}

	:global(.dark) .tag-service {
		background-color: #064e3b;
		color: #a7f3d0;
	}

	.tag-remove {
		display: inline-flex;
		align-items: center;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: inherit;
		opacity: 0.8;
		transition: opacity 0.15s;
	}

	.tag-remove:hover {
		opacity: 1;
	}

	.empty-message {
		color: var(--color-text-tertiary, #6b7280);
		font-size: 0.875rem;
		font-style: italic;
	}

	:global(.dark) .empty-message {
		color: var(--color-text-tertiary-dark, #9ca3af);
	}

	.options-section {
		margin-bottom: 0.75rem;
	}

	.options-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary, #374151);
		margin-bottom: 0.5rem;
	}

	:global(.dark) .options-label {
		color: var(--color-text-secondary-dark, #d1d5db);
	}

	.option-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.option-button {
		padding: 0.25rem 0.75rem;
		font-size: 0.875rem;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
		background-color: var(--color-bg-tertiary, #f3f4f6);
		color: var(--color-text-primary, #1f2937);
	}

	.option-button:hover:not(.selected) {
		background-color: var(--color-bg-hover, #e5e7eb);
	}

	.option-button.selected {
		background-color: #3b82f6;
		color: #ffffff;
	}

	.option-button-service.selected {
		background-color: #10b981;
		color: #ffffff;
	}

	:global(.dark) .option-button {
		background-color: var(--color-bg-tertiary-dark, #4b5563);
		color: var(--color-text-primary-dark, #f9fafb);
	}

	:global(.dark) .option-button:hover:not(.selected) {
		background-color: var(--color-bg-hover-dark, #6b7280);
	}

	:global(.dark) .option-button.selected {
		background-color: #2563eb;
	}

	:global(.dark) .option-button-service.selected {
		background-color: #059669;
	}

	.input-group {
		display: flex;
	}

	.input-group-field {
		flex: 1;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.input-group-button {
		padding: 0.5rem 0.75rem;
		border: none;
		border-top-right-radius: 0.375rem;
		border-bottom-right-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.15s;
		color: #ffffff;
	}

	.button-event-type {
		background-color: #2563eb;
	}

	.button-event-type:hover {
		background-color: #1d4ed8;
	}

	.button-event-type:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
	}

	.button-service {
		background-color: #059669;
	}

	.button-service:hover {
		background-color: #047857;
	}

	.button-service:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.2);
	}

	:global(.dark) .button-event-type {
		background-color: #1e40af;
	}

	:global(.dark) .button-event-type:hover {
		background-color: #1e3a8a;
	}

	:global(.dark) .button-service {
		background-color: #047857;
	}

	:global(.dark) .button-service:hover {
		background-color: #065f46;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border, #e5e7eb);
	}

	:global(.dark) .form-actions {
		border-color: var(--color-border-dark, #4b5563);
	}
</style>
