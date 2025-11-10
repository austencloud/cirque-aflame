<script lang="ts">
	import type { Client } from '$lib/types';
	import Select from 'svelte-select';
	import { DatePicker } from 'bits-ui';
	import { CalendarDate, parseDate } from '@internationalized/date';
	import type { DateValue } from '@internationalized/date';

	interface Props {
		formData: any;
		clients: Client[];
		statusOptions: any[];
	}

	let { formData = $bindable(), clients, statusOptions }: Props = $props();

	// Convert between string date and DateValue
	let dateValue = $state<DateValue | undefined>(
		formData.date ? parseDate(formData.date) : undefined
	);

	// When dateValue changes, update formData.date
	$effect(() => {
		if (dateValue) {
			formData.date = `${dateValue.year}-${String(dateValue.month).padStart(2, '0')}-${String(dateValue.day).padStart(2, '0')}`;
		}
	});

	// Format clients for svelte-select
	const clientOptions = $derived(
		clients.map((c) => ({
			value: c.id,
			label: c.name
		}))
	);

	let selectedClient = $derived(clientOptions.find((c) => c.value === formData.client));

	// Handle client selection change
	function handleClientChange(event: CustomEvent<{ value: string; label: string } | null>) {
		formData.client = event.detail ? event.detail.value : '';
	}
</script>

<div class="section-container" data-component="BasicInfoSection">
	<h3 class="section-title">Basic Information</h3>
	
	<div class="form-grid">
		<!-- Event Name -->
		<div class="input-group">
			<label for="name" class="form-label">Event Name *</label>
			<input
				type="text"
				id="name"
				bind:value={formData.name}
				class="form-input"
				required
			/>
		</div>

		<!-- Event Date -->
		<div class="input-group">
			<label for="eventDate" class="form-label">Event Date *</label>
			<DatePicker.Root bind:value={dateValue} weekdayFormat="short" required>
				<DatePicker.Input class="date-picker-input">
					{#snippet children({ segments })}
						<div class="date-segments-container">
							{#each segments as { part, value }}
								{#if part === 'literal'}
									<DatePicker.Segment {part} class="date-literal">
										{value}
									</DatePicker.Segment>
								{:else}
									<DatePicker.Segment {part} class="date-segment">
										{value}
									</DatePicker.Segment>
								{/if}
							{/each}
						</div>
						<DatePicker.Trigger class="date-trigger">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
								<line x1="16" y1="2" x2="16" y2="6"></line>
								<line x1="8" y1="2" x2="8" y2="6"></line>
								<line x1="3" y1="10" x2="21" y2="10"></line>
							</svg>
						</DatePicker.Trigger>
					{/snippet}
				</DatePicker.Input>
				<DatePicker.Content sideOffset={8} class="date-picker-content">
					<DatePicker.Calendar class="date-picker-calendar">
						{#snippet children({ months, weekdays })}
							<DatePicker.Header class="calendar-header">
								<DatePicker.PrevButton class="calendar-nav-button">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<polyline points="15 18 9 12 15 6"></polyline>
									</svg>
								</DatePicker.PrevButton>
								<DatePicker.Heading class="calendar-heading" />
								<DatePicker.NextButton class="calendar-nav-button">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<polyline points="9 18 15 12 9 6"></polyline>
									</svg>
								</DatePicker.NextButton>
							</DatePicker.Header>
							{#each months as month}
								<DatePicker.Grid class="calendar-grid">
									<DatePicker.GridHead>
										<DatePicker.GridRow class="calendar-weekdays">
											{#each weekdays as day}
												<DatePicker.HeadCell class="calendar-weekday">
													{day.slice(0, 2)}
												</DatePicker.HeadCell>
											{/each}
										</DatePicker.GridRow>
									</DatePicker.GridHead>
									<DatePicker.GridBody>
										{#each month.weeks as weekDates}
											<DatePicker.GridRow class="calendar-week">
												{#each weekDates as date}
													<DatePicker.Cell {date} month={month.value} class="calendar-cell">
														<DatePicker.Day class="calendar-day">
															{date.day}
														</DatePicker.Day>
													</DatePicker.Cell>
												{/each}
											</DatePicker.GridRow>
										{/each}
									</DatePicker.GridBody>
								</DatePicker.Grid>
							{/each}
						{/snippet}
					</DatePicker.Calendar>
				</DatePicker.Content>
			</DatePicker.Root>
		</div>

		<!-- Client Selection -->
		<div class="input-group">
			<label for="client" class="form-label">Client *</label>
			<Select
				id="client"
				items={clientOptions}
				bind:value={selectedClient}
				on:select={handleClientChange}
				placeholder="Select a client..."
				required
			/>
			<a href="/clients/new" target="_blank" class="add-new-link">
				+ Add New Client
			</a>
		</div>

		<!-- Event Status -->
		<div class="input-group">
			<label for="status" class="form-label">Event Status</label>
			<select id="status" bind:value={formData.status} class="form-input">
				{#each statusOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<!-- Event Location -->
		<div class="input-group full-width">
			<label for="location" class="form-label">Location Address *</label>
			<textarea
				id="location"
				bind:value={formData.location.address}
				rows="2"
				class="form-input"
				required
			></textarea>
		</div>

		<div class="input-group">
			<label for="locationNotes" class="form-label">Location Notes</label>
			<textarea
				id="locationNotes"
				bind:value={formData.location.notes}
				rows="2"
				class="form-input"
			></textarea>
		</div>

		<div class="input-group">
			<label for="mapLink" class="form-label">Map Link</label>
			<input
				type="url"
				id="mapLink"
				bind:value={formData.location.mapLink}
				class="form-input"
				placeholder="https://maps.google.com/..."
			/>
		</div>
	</div>
</div>

<style>
	.section-container {
		padding: 0;
	}

	.section-title {
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-gray-900);
		margin-bottom: 1rem;
	}

	:global(.dark) .section-title {
		color: var(--color-gray-100);
		background: linear-gradient(135deg, var(--color-flame-400), var(--color-royal-400));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
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

	.input-group {
		display: flex;
		flex-direction: column;
	}

	.full-width {
		grid-column: 1 / -1;
	}

	.add-new-link {
		font-size: 0.75rem;
		color: var(--color-flame-600);
		margin-top: 0.25rem;
		display: block;
		transition: all var(--transition-base);
	}

	.add-new-link:hover {
		text-decoration: underline;
		color: var(--color-flame-700);
	}

	:global(.dark) .add-new-link {
		color: var(--color-flame-400);
	}

	:global(.dark) .add-new-link:hover {
		color: var(--color-flame-300);
	}

	/* Date Picker Styles */
	:global(.date-picker-input) {
		width: 100%;
		padding: 0.625rem 1rem;
		border: 2px solid var(--color-gray-300);
		border-radius: var(--radius-lg);
		background: white;
		color: var(--color-gray-900);
		font-size: 0.875rem;
		transition: all var(--transition-base);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	:global(.dark .date-picker-input) {
		background: rgba(31, 41, 55, 0.8);
		color: var(--color-gray-100);
		border-color: var(--color-gray-600);
	}

	:global(.date-picker-input:focus-within) {
		outline: none;
		border-color: var(--color-flame-500);
		box-shadow: var(--shadow-glow-sm);
	}

	:global(.dark .date-picker-input:focus-within) {
		background: rgba(31, 41, 55, 0.95);
		border-color: var(--color-flame-500);
	}

	:global(.date-segments-container) {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		flex: 1;
	}

	:global(.date-segment) {
		outline: none;
		caret-color: transparent;
		padding: 0.25rem 0.375rem;
		border-radius: var(--radius-sm);
		font-variant-numeric: tabular-nums;
		transition: all var(--transition-fast);
		min-width: 1.5rem;
		text-align: center;
	}

	:global(.date-segment:hover) {
		background: rgba(249, 115, 22, 0.1);
	}

	:global(.date-segment:focus) {
		background: rgba(249, 115, 22, 0.15);
		color: var(--color-flame-600);
	}

	:global(.dark .date-segment:hover) {
		background: rgba(249, 115, 22, 0.15);
	}

	:global(.dark .date-segment:focus) {
		background: rgba(249, 115, 22, 0.2);
		color: var(--color-flame-400);
	}

	:global(.date-segment[data-placeholder]) {
		color: var(--color-gray-400);
	}

	:global(.dark .date-segment[data-placeholder]) {
		color: var(--color-gray-500);
	}

	:global(.date-literal) {
		color: var(--color-gray-500);
		padding: 0 0.125rem;
	}

	:global(.dark .date-literal) {
		color: var(--color-gray-400);
	}

	:global(.date-trigger) {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: var(--radius-md);
		color: var(--color-flame-600);
		transition: all var(--transition-base);
		margin-left: auto;
	}

	:global(.date-trigger:hover) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.15));
		color: var(--color-flame-700);
	}

	:global(.dark .date-trigger) {
		color: var(--color-flame-400);
	}

	:global(.dark .date-trigger:hover) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(234, 88, 12, 0.2));
		color: var(--color-flame-300);
	}

	/* Calendar Popover */
	:global(.date-picker-content) {
		z-index: 50;
		border-radius: var(--radius-xl);
		padding: 1.5rem;
		animation: slideUpAndFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		/* Glass effect */
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(229, 231, 235, 0.8);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04),
			0 0 0 1px rgba(249, 115, 22, 0.1);
	}

	:global(.dark .date-picker-content) {
		background: rgba(31, 41, 55, 0.95);
		border-color: rgba(75, 85, 99, 0.6);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(249, 115, 22, 0.2);
	}

	@keyframes slideUpAndFade {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Calendar Layout */
	:global(.date-picker-calendar) {
		min-width: 280px;
	}

	:global(.calendar-header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	:global(.calendar-nav-button) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: var(--radius-md);
		color: var(--color-gray-700);
		transition: all var(--transition-base);
		background: transparent;
		border: 1px solid transparent;
	}

	:global(.calendar-nav-button:hover) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(168, 85, 247, 0.1));
		border-color: rgba(249, 115, 22, 0.2);
		color: var(--color-flame-600);
		transform: scale(1.05);
	}

	:global(.dark .calendar-nav-button) {
		color: var(--color-gray-300);
	}

	:global(.dark .calendar-nav-button:hover) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(168, 85, 247, 0.15));
		border-color: rgba(249, 115, 22, 0.3);
		color: var(--color-flame-400);
	}

	:global(.calendar-heading) {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-gray-900);
		background: linear-gradient(135deg, var(--color-flame-600), var(--color-royal-600));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	:global(.dark .calendar-heading) {
		background: linear-gradient(135deg, var(--color-flame-500), var(--color-royal-500));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	:global(.calendar-grid) {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
	}

	:global(.calendar-weekdays) {
		display: flex;
		margin-bottom: 0.5rem;
	}

	:global(.calendar-weekday) {
		width: 2.25rem;
		text-align: center;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-gray-600);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	:global(.dark .calendar-weekday) {
		color: var(--color-gray-400);
	}

	:global(.calendar-week) {
		display: flex;
	}

	:global(.calendar-cell) {
		position: relative;
		padding: 0.125rem;
		text-align: center;
	}

	:global(.calendar-day) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-900);
		border-radius: var(--radius-md);
		border: 2px solid transparent;
		transition: all var(--transition-base);
		cursor: pointer;
		position: relative;
	}

	:global(.dark .calendar-day) {
		color: var(--color-gray-200);
	}

	:global(.calendar-day:hover) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(168, 85, 247, 0.08));
		border-color: rgba(249, 115, 22, 0.3);
		transform: scale(1.08);
	}

	:global(.dark .calendar-day:hover) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(168, 85, 247, 0.12));
		border-color: rgba(249, 115, 22, 0.4);
	}

	/* Selected state */
	:global(.calendar-day[data-selected]) {
		background: linear-gradient(135deg, var(--color-flame-500), var(--color-flame-600));
		color: white !important;
		font-weight: 700;
		border-color: var(--color-flame-700);
		box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.3), 0 2px 4px -1px rgba(249, 115, 22, 0.2),
			0 0 0 3px rgba(249, 115, 22, 0.1);
		transform: scale(1.05);
	}

	:global(.dark .calendar-day[data-selected]) {
		background: linear-gradient(135deg, var(--color-flame-500), var(--color-flame-600));
		box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.4), 0 2px 4px -1px rgba(249, 115, 22, 0.3),
			0 0 0 3px rgba(249, 115, 22, 0.15);
	}

	/* Today indicator */
	:global(.calendar-day[data-today]:not([data-selected])::after) {
		content: '';
		position: absolute;
		bottom: 3px;
		left: 50%;
		transform: translateX(-50%);
		width: 4px;
		height: 4px;
		background: linear-gradient(135deg, var(--color-flame-500), var(--color-royal-500));
		border-radius: 50%;
		box-shadow: 0 0 4px rgba(249, 115, 22, 0.5);
	}

	:global(.dark .calendar-day[data-today]:not([data-selected])::after) {
		background: linear-gradient(135deg, var(--color-flame-400), var(--color-royal-400));
		box-shadow: 0 0 6px rgba(249, 115, 22, 0.6);
	}

	/* Disabled/outside month states */
	:global(.calendar-day[data-disabled]),
	:global(.calendar-day[data-outside-month]) {
		color: var(--color-gray-300);
		pointer-events: none;
		cursor: not-allowed;
	}

	:global(.dark .calendar-day[data-disabled]),
	:global(.dark .calendar-day[data-outside-month]) {
		color: var(--color-gray-700);
	}
</style>
