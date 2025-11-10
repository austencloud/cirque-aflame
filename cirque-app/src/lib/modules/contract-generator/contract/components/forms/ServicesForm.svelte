<script lang="ts">
	import type { Services } from '../../domain';
	let { services = $bindable() }: { services: Services } = $props();
</script>

<div class="form-group">
	<h3>Performance Details</h3>
	<div class="form-field">
		<label for="performance-type">Performance Type:</label>
		<input
			id="performance-type"
			type="text"
			bind:value={services.performance_type}
			placeholder="e.g., Stilt Walker, Dancer, Fire Performance"
		/>
	</div>
	<div class="form-field">
		<label for="duration">Duration (minutes):</label>
		<input id="duration" type="number" bind:value={services.duration_minutes} min="1" max="300" />
	</div>
	<div class="form-field">
		<label> <input type="checkbox" bind:checked={services.time_tbd} /> Time TBD </label>
	</div>
	{#if !services.time_tbd}
		<div class="form-field">
			<label for="performance-time">Performance Time:</label>
			<input id="performance-time" type="time" bind:value={services.performance_time} />
		</div>
	{/if}
	<div class="form-field">
		<label for="costume">Costume:</label>
		<input
			id="costume"
			type="text"
			bind:value={services.costume}
			placeholder="e.g., Caribbean-themed stilt costume"
		/>
	</div>
	<div class="form-field">
		<label for="music-provider">Music Provided By:</label>
		<select id="music-provider" bind:value={services.music_provided_by}>
			<option>Client</option> <option>Performer</option> <option>Venue</option>
			<option>None Required</option>
		</select>
	</div>
	<div class="form-field">
		<label for="music-notes">Music Notes:</label>
		<input
			id="music-notes"
			type="text"
			bind:value={services.music_notes}
			placeholder="Additional notes about music"
		/>
	</div>
	<div class="form-field">
		<label for="additional-services">Additional Services:</label>
		<textarea
			id="additional-services"
			bind:value={services.additional_services}
			placeholder="Describe any additional services or special requests"
			rows="4"
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
	select,
	textarea {
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 14px;
		font-family: inherit;
	}
	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: #2196f3;
		box-shadow: 0 0 5px rgba(33, 150, 243, 0.3);
	}
	input[type='checkbox'] {
		width: auto;
		margin-right: 8px;
	}
</style>
