<script lang="ts">
	import { agents } from '$lib/state/agents.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { ContactMethod } from '$lib/types';

	// Form state
	let name = $state('');
	let agency = $state('');
	let email = $state('');
	let phone = $state('');
	let preferredContactMethod = $state<ContactMethod>('email');
	let specialization = $state<string[]>([]);
	let specializationInput = $state('');
	let partnershipStartDate = $state('');
	let paymentTerms = $state('');
	let commissionRate = $state('');
	let notes = $state('');
	let saving = $state(false);
	let error = $state('');

	// Specialization management
	function addSpecialization() {
		if (specializationInput.trim() && !specialization.includes(specializationInput.trim())) {
			specialization = [...specialization, specializationInput.trim()];
			specializationInput = '';
		}
	}

	function removeSpecialization(spec: string) {
		specialization = specialization.filter((s) => s !== spec);
	}

	// Form validation
	function validateForm(): boolean {
		if (!name.trim()) {
			error = 'Name is required';
			return false;
		}
		if (!agency.trim()) {
			error = 'Agency is required';
			return false;
		}
		if (!email.trim()) {
			error = 'Email is required';
			return false;
		}
		if (!phone.trim()) {
			error = 'Phone is required';
			return false;
		}
		error = '';
		return true;
	}

	// Submit handler
	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		saving = true;
		error = '';

		try {
			await agents.addAgent({
				name: name.trim(),
				agency: agency.trim(),
				email: email.trim(),
				phone: phone.trim(),
				preferredContactMethod,
				specialization,
				opportunitiesSent: [],
				partnershipStartDate: partnershipStartDate ? new Date(partnershipStartDate) : null,
				paymentTerms: paymentTerms.trim(),
				commissionRate: commissionRate ? parseFloat(commissionRate) : undefined,
				notes: notes.trim()
			});

			// Redirect to agents list
			window.location.href = '/agents';
		} catch (err) {
			console.error('Error creating agent:', err);
			error = 'Failed to create agent. Please try again.';
		} finally {
			saving = false;
		}
	}
</script>

<div class="page-container">
	<div class="page-header">
		<div class="header-nav">
			<button onclick={() => (window.location.href = '/agents')} class="back-button">
				<Icon name="arrow-left" size={24} />
			</button>
			<h1 class="page-title">Add New Agent</h1>
		</div>
	</div>

	<form onsubmit={handleSubmit} class="form-card">
		<div class="form-content">
			<!-- Error Message -->
			{#if error}
				<div class="error-message">
					<div class="error-content">
						<Icon name="alert-circle" size={20} extraClass="error-icon" />
						<p class="error-text">{error}</p>
					</div>
				</div>
			{/if}

			<!-- Basic Information -->
			<div class="form-section">
				<h2 class="section-title">Basic Information</h2>
				<div class="field-grid">
					<div class="field-group">
						<label for="name" class="field-label">
							Name
							<span class="required-mark">*</span>
						</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							required
							class="form-input"
							placeholder="John Doe"
						/>
					</div>
					<div class="field-group">
						<label for="agency" class="field-label">
							Agency
							<span class="required-mark">*</span>
						</label>
						<input
							type="text"
							id="agency"
							bind:value={agency}
							required
							class="form-input"
							placeholder="ABC Talent Agency"
						/>
					</div>
				</div>
			</div>

			<!-- Contact Information -->
			<div class="form-section">
				<h2 class="section-title">Contact Information</h2>
				<div class="field-grid">
					<div class="field-group">
						<label for="email" class="field-label">
							Email
							<span class="required-mark">*</span>
						</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							class="form-input"
							placeholder="john@example.com"
						/>
					</div>
					<div class="field-group">
						<label for="phone" class="field-label">
							Phone
							<span class="required-mark">*</span>
						</label>
						<input
							type="tel"
							id="phone"
							bind:value={phone}
							required
							class="form-input"
							placeholder="555-1234"
						/>
					</div>
					<div class="field-group field-group-full">
						<label for="contactMethod" class="field-label"> Preferred Contact Method </label>
						<select id="contactMethod" bind:value={preferredContactMethod} class="form-input">
							<option value="email">Email</option>
							<option value="phone">Phone</option>
							<option value="text">Text</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Specialization -->
			<div class="form-section">
				<h2 class="section-title">Specialization</h2>
				<div class="specialization-section">
					<div class="specialization-input-group">
						<input
							type="text"
							bind:value={specializationInput}
							onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
							class="form-input"
							placeholder="e.g., Fire Performance, Acrobatics"
						/>
						<Button type="button" onclick={addSpecialization} variant="outline">
							{#snippet children()}
								<Icon name="plus" size={18} extraClass="button-icon" />
								Add
							{/snippet}
						</Button>
					</div>
					{#if specialization.length > 0}
						<div class="specialization-tags">
							{#each specialization as spec}
								<span class="specialization-tag">
									{spec}
									<button
										type="button"
										onclick={() => removeSpecialization(spec)}
										class="tag-remove-button"
									>
										<Icon name="x" size={14} />
									</button>
								</span>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Partnership Details -->
			<div class="form-section">
				<h2 class="section-title">Partnership Details</h2>
				<div class="field-grid">
					<div class="field-group">
						<label for="startDate" class="field-label"> Partnership Start Date </label>
						<input type="date" id="startDate" bind:value={partnershipStartDate} class="form-input" />
					</div>
					<div class="field-group">
						<label for="commissionRate" class="field-label"> Commission Rate (%) </label>
						<input
							type="number"
							id="commissionRate"
							bind:value={commissionRate}
							min="0"
							max="100"
							step="0.1"
							class="form-input"
							placeholder="15"
						/>
					</div>
					<div class="field-group field-group-full">
						<label for="paymentTerms" class="field-label"> Payment Terms </label>
						<input
							type="text"
							id="paymentTerms"
							bind:value={paymentTerms}
							class="form-input"
							placeholder="Net 30"
						/>
					</div>
				</div>
			</div>

			<!-- Notes -->
			<div class="form-section">
				<label for="notes" class="field-label"> Notes </label>
				<textarea
					id="notes"
					bind:value={notes}
					rows="4"
					class="form-input"
					placeholder="Additional notes about this agent..."
				></textarea>
			</div>
		</div>

		<!-- Form Actions -->
		<div class="form-actions">
			<Button
				type="button"
				variant="outline"
				onclick={() => (window.location.href = '/agents')}
				disabled={saving}
			>
				{#snippet children()}Cancel{/snippet}
			</Button>
			<Button type="submit" disabled={saving}>
				{#snippet children()}
					{#if saving}
						<Icon name="loader" size={18} extraClass="button-icon animate-spin" />
						Creating...
					{:else}
						<Icon name="check" size={18} extraClass="button-icon" />
						Create Agent
					{/if}
				{/snippet}
			</Button>
		</div>
	</form>
</div>

<style>
	.page-container {
		max-width: 56rem;
		margin: 0 auto;
		padding: 1.5rem 1rem;
	}

	@media (min-width: 640px) {
		.page-container {
			padding: 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.page-container {
			padding: 1.5rem 2rem;
		}
	}

	.page-header {
		margin-bottom: 1.5rem;
	}

	.header-nav {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.back-button {
		color: var(--color-gray-600);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: color var(--transition-base);
		padding: 0.5rem;
		border-radius: var(--radius-md);
	}

	.back-button:hover {
		color: var(--color-gray-900);
		background: var(--color-gray-100);
	}

	.page-title {
		font-size: 1.875rem;
		font-weight: 700;
		color: var(--color-gray-900);
	}

	.form-card {
		background: white;
		box-shadow: var(--shadow-soft);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.form-content {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.error-message {
		background: rgba(254, 226, 226, 0.8);
		border: 1px solid rgba(252, 165, 165, 0.8);
		border-radius: var(--radius-md);
		padding: 1rem;
	}

	.error-content {
		display: flex;
		align-items: flex-start;
	}

	:global(.error-icon) {
		color: var(--color-red-500);
		margin-right: 0.5rem;
		flex-shrink: 0;
	}

	.error-text {
		font-size: 0.875rem;
		color: var(--color-red-800);
	}

	.form-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-title {
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-gray-900);
	}

	.field-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.field-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.field-group {
		display: flex;
		flex-direction: column;
	}

	.field-group-full {
		grid-column: 1 / -1;
	}

	.field-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-700);
		margin-bottom: 0.25rem;
	}

	.required-mark {
		color: var(--color-red-500);
	}

	.form-input {
		display: block;
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-gray-300);
		border-radius: var(--radius-md);
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		color: var(--color-gray-900);
		font-size: 0.875rem;
		transition: all var(--transition-base);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-flame-500);
		box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
	}

	.specialization-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.specialization-input-group {
		display: flex;
		gap: 0.5rem;
	}

	.specialization-input-group .form-input {
		flex: 1;
	}

	:global(.button-icon) {
		margin-right: 0.25rem;
	}

	.specialization-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.specialization-tag {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-full);
		font-size: 0.875rem;
		background: rgba(219, 234, 254, 0.8);
		color: #1e40af;
	}

	.tag-remove-button {
		margin-left: 0.5rem;
		color: #2563eb;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		transition: color var(--transition-base);
	}

	.tag-remove-button:hover {
		color: #1e40af;
	}

	.form-actions {
		padding: 1rem 1.5rem;
		background: var(--color-gray-50);
		border-top: 1px solid var(--color-gray-200);
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}
</style>
