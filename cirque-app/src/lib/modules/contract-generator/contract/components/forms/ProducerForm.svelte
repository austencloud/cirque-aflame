<script lang="ts">
	import type { Producer } from '../../domain';
	let { producer = $bindable() }: { producer: Producer } = $props();
</script>

<div class="form-group">
	<h3>Producer Information</h3>
	<div class="form-field">
		<label for="producer-name">Name:</label>
		<input
			id="producer-name"
			type="text"
			bind:value={producer.name}
			placeholder="Producer's full name"
		/>
	</div>
	<div class="form-field">
		<label for="producer-company">Company:</label>
		<input
			id="producer-company"
			type="text"
			bind:value={producer.company}
			placeholder="Production company name"
		/>
	</div>
	<div class="form-field">
		<label for="producer-phone">Phone:</label>
		<input
			id="producer-phone"
			type="tel"
			bind:value={producer.phone}
			placeholder="Format: 123-456-7890"
		/>
	</div>
	<div class="form-field">
		<label for="producer-email">Email:</label>
		<input
			id="producer-email"
			type="email"
			bind:value={producer.email}
			placeholder="producer@example.com"
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
