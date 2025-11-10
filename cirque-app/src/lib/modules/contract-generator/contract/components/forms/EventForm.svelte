<script lang="ts">
	import type { Contract } from '../../domain';
	let { contract = $bindable() }: { contract: Contract } = $props();
</script>

<div class="form-group">
	<h3>Contract Information</h3>
	<div class="form-field">
		<label for="title">Contract Title:</label>
		<input
			id="title"
			type="text"
			bind:value={contract.title}
			placeholder="e.g., Caribbean Dance Performance Agreement"
		/>
	</div>
	<div class="form-field">
		<label for="subtitle">Contract Subtitle:</label>
		<input
			id="subtitle"
			type="text"
			bind:value={contract.subtitle}
			placeholder="e.g., Official Contract for Live Performance Services"
		/>
	</div>
	<div class="form-field">
		<label for="effective-date">Effective Date:</label>
		<input id="effective-date" type="date" bind:value={contract.effective_date} />
	</div>
</div>
<div class="form-group">
	<h3>Event Details</h3>
	<div class="form-field">
		<label for="event-location">Location:</label>
		<input
			id="event-location"
			type="text"
			bind:value={contract.event.location}
			placeholder="e.g., Harold Washington Social Security Center, Chicago, IL"
		/>
	</div>
	<div class="form-field">
		<label for="event-date">Event Date:</label>
		<input id="event-date" type="date" bind:value={contract.event.date} />
	</div>
	<div class="form-field">
		<label for="performer-name">Performer Name:</label>
		<input
			id="performer-name"
			type="text"
			bind:value={contract.performer_name}
			placeholder="e.g., Robert Bershadsky"
		/>
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
	input {
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 14px;
	}
	input:focus {
		outline: none;
		border-color: #2196f3;
		box-shadow: 0 0 5px rgba(33, 150, 243, 0.3);
	}
</style>
