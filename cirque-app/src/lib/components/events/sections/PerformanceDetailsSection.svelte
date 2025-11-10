<script lang="ts">
	import { TimeField, type TimeValue } from 'bits-ui';
	import { Time, parseTime } from '@internationalized/date';

	interface Props {
		formData: any;
	}

	let { formData = $bindable() }: Props = $props();

	// Convert string times to Time objects
	function parseTimeValue(timeString: string | undefined): TimeValue | undefined {
		if (!timeString) return undefined;
		try {
			return parseTime(timeString);
		} catch {
			return undefined;
		}
	}

	// Convert Time object to HH:MM string
	function formatTimeValue(timeValue: TimeValue | undefined): string {
		if (!timeValue) return '';
		return `${String(timeValue.hour).padStart(2, '0')}:${String(timeValue.minute).padStart(2, '0')}`;
	}

	// Initialize time values
	let startTime = $state<TimeValue | undefined>(
		parseTimeValue(formData.performanceTime?.start) || new Time(18, 0)
	);
	let endTime = $state<TimeValue | undefined>(
		parseTimeValue(formData.performanceTime?.end) || new Time(20, 0)
	);
	let callTime = $state<TimeValue | undefined>(
		parseTimeValue(formData.callTime) || new Time(17, 0)
	);

	// Sync time values back to formData
	$effect(() => {
		if (!formData.performanceTime) {
			formData.performanceTime = {};
		}
		formData.performanceTime.start = formatTimeValue(startTime);
		formData.performanceTime.end = formatTimeValue(endTime);
		formData.callTime = formatTimeValue(callTime);
	});
</script>

<div class="performance-container" data-component="PerformanceDetailsSection">
	<h3 class="performance-title">Performance Details</h3>
	
	<div class="form-grid">
		<!-- Start Time -->
		<div class="input-group">
			<label for="startTime" class="form-label">Performance Start Time</label>
			<TimeField.Root bind:value={startTime}>
				<TimeField.Input name="startTime" class="time-field-input">
					{#snippet children({ segments })}
						{#each segments as { part, value }}
							{#if part === 'literal'}
								<TimeField.Segment {part} class="time-literal">
									{value}
								</TimeField.Segment>
							{:else}
								<TimeField.Segment {part} class="time-segment">
									{value}
								</TimeField.Segment>
							{/if}
						{/each}
					{/snippet}
				</TimeField.Input>
			</TimeField.Root>
		</div>

		<!-- End Time -->
		<div class="input-group">
			<label for="endTime" class="form-label">Performance End Time</label>
			<TimeField.Root bind:value={endTime}>
				<TimeField.Input name="endTime" class="time-field-input">
					{#snippet children({ segments })}
						{#each segments as { part, value }}
							{#if part === 'literal'}
								<TimeField.Segment {part} class="time-literal">
									{value}
								</TimeField.Segment>
							{:else}
								<TimeField.Segment {part} class="time-segment">
									{value}
								</TimeField.Segment>
							{/if}
						{/each}
					{/snippet}
				</TimeField.Input>
			</TimeField.Root>
		</div>

		<!-- Call Time -->
		<div class="input-group">
			<label for="callTime" class="form-label">Call Time</label>
			<TimeField.Root bind:value={callTime}>
				<TimeField.Input name="callTime" class="time-field-input">
					{#snippet children({ segments })}
						{#each segments as { part, value }}
							{#if part === 'literal'}
								<TimeField.Segment {part} class="time-literal">
									{value}
								</TimeField.Segment>
							{:else}
								<TimeField.Segment {part} class="time-segment">
									{value}
								</TimeField.Segment>
							{/if}
						{/each}
					{/snippet}
				</TimeField.Input>
			</TimeField.Root>
		</div>

		<!-- Costume -->
		<div class="input-group full-width">
			<label for="costume" class="form-label">Costume Notes</label>
			<textarea
				id="costume"
				bind:value={formData.costume}
				rows="2"
				class="form-input"
				placeholder="e.g. All white, formal wear, themed costumes..."
			></textarea>
		</div>
	</div>
</div>

<style>
	.performance-container {
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
	}	.form-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.form-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.input-group {
		display: flex;
		flex-direction: column;
	}

	.full-width {
		grid-column: 1 / -1;
	}

	/* Time Field Styles */
	:global(.time-field-input) {
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
		gap: 0.25rem;
		cursor: text;
	}

	:global(.dark .time-field-input) {
		background: rgba(31, 41, 55, 0.8);
		color: var(--color-gray-100);
		border-color: var(--color-gray-600);
	}

	:global(.time-field-input:focus-within) {
		outline: none;
		border-color: var(--color-flame-500);
		box-shadow: var(--shadow-glow-sm);
	}

	:global(.dark .time-field-input:focus-within) {
		background: rgba(31, 41, 55, 0.95);
		border-color: var(--color-flame-500);
	}

	:global(.time-segment) {
		outline: none;
		caret-color: transparent;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm);
		font-variant-numeric: tabular-nums;
		transition: all var(--transition-fast);
		min-width: 2rem;
		text-align: center;
		font-weight: 600;
	}

	:global(.time-segment:hover) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.08), rgba(168, 85, 247, 0.06));
	}

	:global(.time-segment:focus) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(168, 85, 247, 0.1));
		color: var(--color-flame-600);
	}

	:global(.dark .time-segment:hover) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.12), rgba(168, 85, 247, 0.08));
	}

	:global(.dark .time-segment:focus) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(168, 85, 247, 0.15));
		color: var(--color-flame-400);
	}

	:global(.time-segment[data-placeholder]) {
		color: var(--color-gray-400);
		font-weight: 400;
	}

	:global(.dark .time-segment[data-placeholder]) {
		color: var(--color-gray-500);
	}

	:global(.time-literal) {
		color: var(--color-gray-500);
		padding: 0 0.25rem;
		font-weight: 700;
	}

	:global(.dark .time-literal) {
		color: var(--color-gray-400);
	}

	/* Time segment parts with special styling */
	:global(.time-segment[data-segment='dayPeriod']) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(168, 85, 247, 0.1));
		color: var(--color-flame-600);
		font-weight: 700;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
	}

	:global(.dark .time-segment[data-segment='dayPeriod']) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(168, 85, 247, 0.15));
		color: var(--color-flame-400);
	}

	:global(.time-segment[data-segment='dayPeriod']:hover) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(168, 85, 247, 0.15));
	}

	:global(.time-segment[data-segment='dayPeriod']:focus) {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(168, 85, 247, 0.2));
	}
</style>
