<!-- src/lib/components/performers/PerformerForm.svelte -->
<script lang="ts">
	import type { Performer, PerformerSkillCategory } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	interface Props {
		performer?: Partial<Performer>;
		submitLabel?: string;
		isLoading?: boolean;
		showCancelButton?: boolean;
		onsubmit?: (data: Partial<Performer>) => void;
		oncancel?: () => void;
	}

	const {
		performer = {},
		submitLabel = 'Save Performer',
		isLoading = false,
		showCancelButton = true,
		onsubmit,
		oncancel
	}: Props = $props();

	// Form state - must use $state for bind:value to work in Svelte 5
	let formData = $state({
		name: performer.name || '',
		email: performer.email || '',
		phone: performer.phone || '',
		address: performer.address || '',
		profilePhoto: performer.profilePhoto || '',
		skills: performer.skills || [],
		payRate: performer.payRate || [],
		notes: performer.notes || ''
	});

	// New skill fields
	let newSkillCategory = $state<PerformerSkillCategory>('other');
	let newSkillProps = $state('');
	let newSkillActs = $state('');
	let newSkillLevel = $state<'beginner' | 'intermediate' | 'expert'>('intermediate');

	// New pay rate fields
	let newPayCategory = $state('');
	let newPayRate = $state(0);
	let newPayUnit = $state<'hourly' | 'per-event' | 'per-day'>('hourly');

	// Skill category options
	const skillCategoryOptions: PerformerSkillCategory[] = [
		'fire',
		'balloon',
		'stilt',
		'juggle',
		'aerial',
		'magic',
		'other'
	];

	// Skill category display names
	const skillCategoryNames: Record<PerformerSkillCategory, string> = {
		fire: 'Fire Performance',
		balloon: 'Balloon Art',
		stilt: 'Stilt Walking',
		juggle: 'Juggling',
		aerial: 'Aerial Arts',
		magic: 'Magic',
		other: 'Other Skills'
	};

	// Pay rate category options
	const payRateCategoryOptions = [
		'Fire Performance',
		'Balloon Art',
		'Stilt Walking',
		'Juggling',
		'Aerial Performance',
		'Magic',
		'LED Performance',
		'Ambient Entertainment',
		'Corporate Event',
		'Festival',
		'Private Party'
	];

	// Handle form submission
	function handleSubmit() {
		// Validate form fields
		if (!formData.name) {
			alert('Performer name is required');
			return;
		}
		onsubmit?.(formData);
	}

	// Handle cancel button
	function handleCancel() {
		oncancel?.();
	}

	// Add new skill
	function addSkill() {
		if (newSkillCategory) {
			const props = newSkillProps
				.split(',')
				.map((p) => p.trim())
				.filter(Boolean);

			const acts = newSkillActs
				.split(',')
				.map((a) => a.trim())
				.filter(Boolean);

			formData.skills = [
				...formData.skills,
				{
					category: newSkillCategory,
					props,
					acts,
					level: newSkillLevel
				}
			];

			// Reset fields
			newSkillProps = '';
			newSkillActs = '';
			newSkillLevel = 'intermediate';
		}
	}

	// Remove skill
	function removeSkill(index: number) {
		formData.skills = formData.skills.filter((_: any, i: number) => i !== index);
	}

	// Add new pay rate
	function addPayRate() {
		if (newPayCategory && newPayRate > 0) {
			formData.payRate = [
				...formData.payRate,
				{
					category: newPayCategory,
					rate: newPayRate,
					unit: newPayUnit
				}
			];

			// Reset fields
			newPayCategory = '';
			newPayRate = 0;
		}
	}

	// Remove pay rate
	function removePayRate(index: number) {
		formData.payRate = formData.payRate.filter((_: any, i: number) => i !== index);
	}

	// Get color for skill category
	function getSkillCategoryClass(category: PerformerSkillCategory): string {
		switch (category) {
			case 'fire':
				return 'skill-badge-fire';
			case 'balloon':
				return 'skill-badge-balloon';
			case 'stilt':
				return 'skill-badge-stilt';
			case 'juggle':
				return 'skill-badge-juggle';
			case 'aerial':
				return 'skill-badge-aerial';
			case 'magic':
				return 'skill-badge-magic';
			default:
				return 'skill-badge-other';
		}
	}

	// Get badge class for skill level
	function getSkillLevelClass(level: string): string {
		switch (level) {
			case 'beginner':
				return 'level-badge-beginner';
			case 'intermediate':
				return 'level-badge-intermediate';
			case 'expert':
				return 'level-badge-expert';
			default:
				return 'level-badge-other';
		}
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
	class="performer-form"
	data-component="PerformerForm"
>
	<!-- Basic Information Section -->
	<div class="form-section">
		<h3 class="section-title">Basic Information</h3>
		<div class="form-grid">
			<!-- Performer Name -->
			<div class="form-field">
				<label for="name" class="form-label"> Performer Name * </label>
				<input type="text" id="name" bind:value={formData.name} class="form-input" required />
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

			<!-- Profile Photo URL -->
			<div class="form-field">
				<label for="profilePhoto" class="form-label"> Profile Photo URL </label>
				<input
					type="url"
					id="profilePhoto"
					bind:value={formData.profilePhoto}
					class="form-input"
					placeholder="https://example.com/photo.jpg"
				/>
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

	<!-- Skills Section -->
	<div class="form-section">
		<h3 class="section-title">Skills & Specialties</h3>

		<!-- Existing Skills -->
		{#if formData.skills.length > 0}
			<div class="skills-list">
				<h4 class="subsection-title">Current Skills:</h4>
				{#each formData.skills as skill, index}
					<div class="skill-card">
						<button type="button" class="skill-remove" onclick={() => removeSkill(index)}>
							<Icon name="x" size={18} />
						</button>
						<div class="skill-header">
							<span class="skill-badge {getSkillCategoryClass(skill.category)}">
								{skillCategoryNames[skill.category]}
							</span>
							<span class="level-badge {getSkillLevelClass(skill.level)}">
								{skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
							</span>
						</div>
						{#if skill.props.length > 0}
							<div class="skill-detail">
								<span class="detail-label">Props:</span>
								<div class="detail-tags">
									{#each skill.props as prop}
										<span class="detail-tag">
											{prop}
										</span>
									{/each}
								</div>
							</div>
						{/if}
						{#if skill.acts.length > 0}
							<div class="skill-detail">
								<span class="detail-label">Signature Acts:</span>
								<div class="detail-tags">
									{#each skill.acts as act}
										<span class="detail-tag">
											{act}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<p class="empty-message">No skills added yet</p>
		{/if}

		<!-- Add New Skill Form -->
		<div class="add-skill-form">
			<h4 class="subsection-title">Add a New Skill:</h4>
			<div class="skill-inputs">
				<!-- Skill Category -->
				<div class="form-field">
					<label for="skillCategory" class="form-label-small"> Skill Category </label>
					<select id="skillCategory" bind:value={newSkillCategory} class="form-input">
						{#each skillCategoryOptions as category}
							<option value={category}>{skillCategoryNames[category]}</option>
						{/each}
					</select>
				</div>

				<!-- Skill Level -->
				<div class="form-field">
					<label for="skillLevel" class="form-label-small"> Skill Level </label>
					<select id="skillLevel" bind:value={newSkillLevel} class="form-input">
						<option value="beginner">Beginner</option>
						<option value="intermediate">Intermediate</option>
						<option value="expert">Expert</option>
					</select>
				</div>
			</div>
			<div class="skill-details-inputs">
				<!-- Props -->
				<div class="form-field">
					<label for="skillProps" class="form-label-small"> Props (comma separated) </label>
					<input
						type="text"
						id="skillProps"
						bind:value={newSkillProps}
						placeholder="Poi, Staff, Dragon Staff, Fans"
						class="form-input"
					/>
				</div>

				<!-- Acts -->
				<div class="form-field">
					<label for="skillActs" class="form-label-small">
						Signature Acts (comma separated)
					</label>
					<input
						type="text"
						id="skillActs"
						bind:value={newSkillActs}
						placeholder="Firefly, Cosmic Spin, Aerial Spiral"
						class="form-input"
					/>
				</div>
			</div>
			<div class="add-button-container">
				<Button type="button" onclick={addSkill} size="sm">
					{#snippet children()}
						<Icon name="plus" size={16} extraClass="mr-1" />
						Add Skill
					{/snippet}
				</Button>
			</div>
		</div>
	</div>

	<!-- Pay Rates Section -->
	<div class="form-section">
		<h3 class="section-title">Pay Rates</h3>

		<!-- Existing Pay Rates -->
		{#if formData.payRate.length > 0}
			<div class="pay-rates-list">
				<h4 class="subsection-title">Current Pay Rates:</h4>
				<div class="pay-table">
					<table>
						<thead>
							<tr>
								<th class="pay-table-header">Category</th>
								<th class="pay-table-header">Rate</th>
								<th class="pay-table-header">Unit</th>
								<th class="pay-table-header pay-table-actions">
									<span class="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody>
							{#each formData.payRate as rate, index}
								<tr class="pay-table-row">
									<td class="pay-table-cell pay-table-cell-category">
										{rate.category}
									</td>
									<td class="pay-table-cell pay-table-cell-rate">
										${rate.rate.toFixed(2)}
									</td>
									<td class="pay-table-cell pay-table-cell-unit">
										{rate.unit === 'hourly'
											? 'Per Hour'
											: rate.unit === 'per-event'
												? 'Per Event'
												: 'Per Day'}
									</td>
									<td class="pay-table-cell pay-table-cell-action">
										<button
											type="button"
											class="pay-remove-button"
											onclick={() => removePayRate(index)}
										>
											<Icon name="trash-2" size={16} />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{:else}
			<p class="empty-message">No pay rates added yet</p>
		{/if}

		<!-- Add New Pay Rate Form -->
		<div class="add-pay-form">
			<h4 class="subsection-title">Add a New Pay Rate:</h4>
			<div class="pay-inputs-wrapper">
				<div class="pay-inputs">
					<!-- Pay Rate Category -->
					<div class="form-field">
						<label for="payCategory" class="form-label-small"> Category </label>
						<select id="payCategory" bind:value={newPayCategory} class="form-input">
							<option value="">Select a category</option>
							{#each payRateCategoryOptions as category}
								<option value={category}>{category}</option>
							{/each}
							<option value="Custom">Custom...</option>
						</select>
					</div>

					<!-- Pay Rate Amount -->
					<div class="form-field">
						<label for="payRate" class="form-label-small"> Rate (USD) </label>
						<input
							type="number"
							id="payRate"
							bind:value={newPayRate}
							min="0"
							step="0.01"
							class="form-input"
						/>
					</div>

					<!-- Pay Rate Unit -->
					<div class="form-field">
						<label for="payUnit" class="form-label-small"> Unit </label>
						<select id="payUnit" bind:value={newPayUnit} class="form-input">
							<option value="hourly">Per Hour</option>
							<option value="per-event">Per Event</option>
							<option value="per-day">Per Day</option>
						</select>
					</div>
				</div>
			</div>
			<div class="add-button-container">
				<Button
					type="button"
					onclick={addPayRate}
					size="sm"
					disabled={!newPayCategory || newPayRate <= 0}
				>
					{#snippet children()}
						<Icon name="plus" size={16} extraClass="mr-1" />
						Add Pay Rate
					{/snippet}
				</Button>
			</div>
		</div>
	</div>

	<!-- Notes Section -->
	<div class="form-section">
		<h3 class="section-title">Notes</h3>
		<textarea
			bind:value={formData.notes}
			rows="4"
			class="form-input"
			placeholder="Add any notes about this performer..."
		></textarea>
	</div>

	<!-- Form Actions -->
	<div class="form-actions">
		{#if showCancelButton}
			<Button
				type="button"
				variant="outline"
				color="gray"
				onclick={handleCancel}
				disabled={isLoading}
			>
				{#snippet children()}Cancel{/snippet}
			</Button>
		{/if}
		<Button type="submit" loading={isLoading} disabled={isLoading}>
			{#snippet children()}{submitLabel}{/snippet}
		</Button>
	</div>
</form>

<style>
	.performer-form {
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

	.subsection-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary, #374151);
		margin-bottom: 0.75rem;
	}

	:global(.dark) .subsection-title {
		color: var(--color-text-secondary-dark, #d1d5db);
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

	.form-label-small {
		display: block;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text-tertiary, #6b7280);
		margin-bottom: 0.25rem;
	}

	:global(.dark) .form-label {
		color: var(--color-text-secondary-dark, #d1d5db);
	}

	:global(.dark) .form-label-small {
		color: var(--color-text-tertiary-dark, #9ca3af);
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

	.empty-message {
		color: var(--color-text-tertiary, #6b7280);
		font-size: 0.875rem;
		font-style: italic;
		margin-bottom: 1rem;
	}

	:global(.dark) .empty-message {
		color: var(--color-text-tertiary-dark, #9ca3af);
	}

	/* Skills List Styles */
	.skills-list {
		margin-bottom: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.skill-card {
		background-color: var(--color-bg-primary, #ffffff);
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: 0.5rem;
		padding: 1rem;
		position: relative;
	}

	:global(.dark) .skill-card {
		background-color: var(--color-bg-secondary-dark, #374151);
		border-color: var(--color-border-dark, #4b5563);
	}

	.skill-remove {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: none;
		border: none;
		color: var(--color-text-tertiary, #9ca3af);
		cursor: pointer;
		padding: 0.25rem;
		transition: color 0.15s;
		display: flex;
		align-items: center;
	}

	.skill-remove:hover {
		color: var(--color-text-secondary, #6b7280);
	}

	:global(.dark) .skill-remove {
		color: var(--color-text-tertiary-dark, #6b7280);
	}

	:global(.dark) .skill-remove:hover {
		color: var(--color-text-secondary-dark, #9ca3af);
	}

	.skill-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.skill-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.skill-badge-fire {
		background-color: #fee2e2;
		color: #991b1b;
	}

	:global(.dark) .skill-badge-fire {
		background-color: #7f1d1d;
		color: #fecaca;
	}

	.skill-badge-balloon {
		background-color: #e9d5ff;
		color: #6b21a8;
	}

	:global(.dark) .skill-badge-balloon {
		background-color: #581c87;
		color: #e9d5ff;
	}

	.skill-badge-stilt {
		background-color: #d1fae5;
		color: #065f46;
	}

	:global(.dark) .skill-badge-stilt {
		background-color: #064e3b;
		color: #a7f3d0;
	}

	.skill-badge-juggle {
		background-color: #dbeafe;
		color: #1e40af;
	}

	:global(.dark) .skill-badge-juggle {
		background-color: #1e3a8a;
		color: #bfdbfe;
	}

	.skill-badge-aerial {
		background-color: #fce7f3;
		color: #9f1239;
	}

	:global(.dark) .skill-badge-aerial {
		background-color: #831843;
		color: #fbcfe8;
	}

	.skill-badge-magic {
		background-color: #fef3c7;
		color: #92400e;
	}

	:global(.dark) .skill-badge-magic {
		background-color: #78350f;
		color: #fde68a;
	}

	.skill-badge-other {
		background-color: #f3f4f6;
		color: #1f2937;
	}

	:global(.dark) .skill-badge-other {
		background-color: #4b5563;
		color: #f9fafb;
	}

	.level-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.level-badge-beginner {
		background-color: #dbeafe;
		color: #1e40af;
	}

	:global(.dark) .level-badge-beginner {
		background-color: #1e3a8a;
		color: #bfdbfe;
	}

	.level-badge-intermediate {
		background-color: #fef3c7;
		color: #92400e;
	}

	:global(.dark) .level-badge-intermediate {
		background-color: #78350f;
		color: #fde68a;
	}

	.level-badge-expert {
		background-color: #d1fae5;
		color: #065f46;
	}

	:global(.dark) .level-badge-expert {
		background-color: #064e3b;
		color: #a7f3d0;
	}

	.level-badge-other {
		background-color: #f3f4f6;
		color: #1f2937;
	}

	:global(.dark) .level-badge-other {
		background-color: #4b5563;
		color: #f9fafb;
	}

	.skill-detail {
		margin-bottom: 0.5rem;
	}

	.skill-detail:last-child {
		margin-bottom: 0;
	}

	.detail-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary, #6b7280);
		display: block;
		margin-bottom: 0.25rem;
	}

	:global(.dark) .detail-label {
		color: var(--color-text-tertiary-dark, #9ca3af);
	}

	.detail-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.detail-tag {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		background-color: var(--color-bg-tertiary, #f3f4f6);
		color: var(--color-text-primary, #1f2937);
		border-radius: 9999px;
		font-size: 0.75rem;
	}

	:global(.dark) .detail-tag {
		background-color: var(--color-bg-tertiary-dark, #4b5563);
		color: var(--color-text-primary-dark, #f9fafb);
	}

	/* Add Skill Form Styles */
	.add-skill-form {
		background-color: var(--color-bg-tertiary, #f9fafb);
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: 0.5rem;
		padding: 1rem;
	}

	:global(.dark) .add-skill-form {
		background-color: var(--color-bg-tertiary-dark, #1f2937);
		border-color: var(--color-border-dark, #374151);
	}

	.skill-inputs {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	@media (min-width: 768px) {
		.skill-inputs {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.skill-details-inputs {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.add-button-container {
		margin-top: 1rem;
	}

	/* Pay Rates Styles */
	.pay-rates-list {
		margin-bottom: 1.5rem;
	}

	.pay-table {
		background-color: var(--color-bg-primary, #ffffff);
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	:global(.dark) .pay-table {
		background-color: var(--color-bg-secondary-dark, #374151);
		border-color: var(--color-border-dark, #4b5563);
	}

	.pay-table table {
		width: 100%;
		border-collapse: collapse;
	}

	.pay-table-header {
		padding: 0.75rem 1.5rem;
		text-align: left;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text-tertiary, #6b7280);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background-color: var(--color-bg-tertiary, #f9fafb);
		border-bottom: 1px solid var(--color-border, #e5e7eb);
	}

	:global(.dark) .pay-table-header {
		background-color: var(--color-bg-tertiary-dark, #1f2937);
		border-color: var(--color-border-dark, #4b5563);
		color: var(--color-text-tertiary-dark, #9ca3af);
	}

	.pay-table-actions {
		position: relative;
		padding: 0.75rem 1.5rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.pay-table-row {
		border-bottom: 1px solid var(--color-border, #e5e7eb);
	}

	:global(.dark) .pay-table-row {
		border-color: var(--color-border-dark, #4b5563);
	}

	.pay-table-cell {
		padding: 1rem 1.5rem;
		white-space: nowrap;
		font-size: 0.875rem;
	}

	.pay-table-cell-category {
		font-weight: 500;
		color: var(--color-text-primary, #111827);
	}

	:global(.dark) .pay-table-cell-category {
		color: var(--color-text-primary-dark, #f9fafb);
	}

	.pay-table-cell-rate,
	.pay-table-cell-unit {
		color: var(--color-text-tertiary, #6b7280);
	}

	:global(.dark) .pay-table-cell-rate,
	:global(.dark) .pay-table-cell-unit {
		color: var(--color-text-tertiary-dark, #9ca3af);
	}

	.pay-table-cell-action {
		text-align: right;
		font-weight: 500;
	}

	.pay-remove-button {
		background: none;
		border: none;
		color: #dc2626;
		cursor: pointer;
		padding: 0.25rem;
		transition: color 0.15s;
		display: inline-flex;
		align-items: center;
	}

	.pay-remove-button:hover {
		color: #b91c1c;
	}

	:global(.dark) .pay-remove-button {
		color: #ef4444;
	}

	:global(.dark) .pay-remove-button:hover {
		color: #dc2626;
	}

	/* Add Pay Rate Form Styles */
	.add-pay-form {
		background-color: var(--color-bg-tertiary, #f9fafb);
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: 0.5rem;
		padding: 1rem;
	}

	:global(.dark) .add-pay-form {
		background-color: var(--color-bg-tertiary-dark, #1f2937);
		border-color: var(--color-border-dark, #374151);
	}

	.pay-inputs-wrapper {
		max-width: 48rem;
	}

	.pay-inputs {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.pay-inputs {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* Form Actions */
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
