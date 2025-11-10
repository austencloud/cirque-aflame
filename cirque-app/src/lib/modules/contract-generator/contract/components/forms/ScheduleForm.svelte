<script lang="ts">
	import type { Schedule } from '../../domain';
	let { schedule = $bindable() }: { schedule: Schedule } = $props();
</script>

<div class="form-group">
	<h3>Arrival and Setup</h3>
	<div class="form-field">
		<label for="arrival-minutes">Performer Arrival (minutes before performance):</label>
		<input
			id="arrival-minutes"
			type="number"
			bind:value={schedule.arrival_minutes_before}
			min="15"
			max="120"
			step="5"
		/>
	</div>
	<div class="form-field">
		<label for="setup-minutes">Setup Time Required (minutes):</label>
		<input
			id="setup-minutes"
			type="number"
			bind:value={schedule.setup_minutes}
			min="5"
			max="60"
			step="5"
		/>
	</div>
</div>
<div class="form-group">
	<h3>Late Arrival Policy</h3>
	<div class="form-field">
		<textarea
			bind:value={schedule.late_policy}
			placeholder="Enter policy for late arrivals"
			rows="5"
		></textarea>
	</div>
</div>
<div class="form-group">
	<h3>Schedule Changes</h3>
	<div class="form-field">
		<textarea
			bind:value={schedule.changes_policy}
			placeholder="Enter policy for schedule changes"
			rows="5"
		></textarea>
	</div>
</div>

<style>
	.form-group {
		margin-bottom: 20px;
		padding: 15px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	.form-group h3 {
		margin-top: 0;
		color: #333;
	}
	.form-field {
		margin-bottom: 15px;
		display: flex;
		flex-direction: column;
	}
	label {
		font-weight: bold;
		margin-bottom: 5px;
		color: #555;
	}
	input,
	textarea {
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 14px;
		font-family: inherit;
	}
	input:focus,
	textarea:focus {
		outline: none;
		border-color: #2196f3;
		box-shadow: 0 0 5px rgba(33, 150, 243, 0.3);
	}
</style>
