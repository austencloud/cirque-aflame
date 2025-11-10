<script lang="ts">
	import type { Client } from '../../domain';
	let { client = $bindable() }: { client: Client } = $props();
</script>

<div class="form-group">
	<h3>Client Information</h3>
	<div class="form-field">
		<label for="client-name">Name:</label>
		<input
			id="client-name"
			type="text"
			bind:value={client.name}
			placeholder="Enter client's full name"
		/>
	</div>
	<div class="form-field">
		<label for="client-phone">Phone:</label>
		<input
			id="client-phone"
			type="tel"
			bind:value={client.phone}
			placeholder="Format: 123-456-7890"
		/>
	</div>
	<div class="form-field">
		<label for="client-email">Email:</label>
		<input
			id="client-email"
			type="email"
			bind:value={client.email}
			placeholder="client@example.com"
		/>
	</div>
	<div class="form-field">
		<label for="client-title">Title:</label>
		<input
			id="client-title"
			type="text"
			bind:value={client.title}
			placeholder="Client's professional title"
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
