<script lang="ts">
	import type { Cancellation } from '../../domain';
	let { cancellation = $bindable() }: { cancellation: Cancellation } = $props();
</script>

<div class="form-group">
	<h3>Client Cancellation</h3>
	<div class="form-field">
		<textarea
			bind:value={cancellation.client_policy}
			placeholder="Enter policy for client cancellations"
			rows="5"
		></textarea>
	</div>
</div>
<div class="form-group">
	<h3>Producer Cancellation</h3>
	<div class="form-field">
		<textarea
			bind:value={cancellation.producer_policy}
			placeholder="Enter policy for producer cancellations"
			rows="5"
		></textarea>
	</div>
</div>
<div class="form-group">
	<h3>Force Majeure</h3>
	<div class="form-field">
		<textarea
			bind:value={cancellation.force_majeure}
			placeholder="Enter policy for cancellations due to force majeure"
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
	}
	textarea {
		width: 100%;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 14px;
		font-family: inherit;
		box-sizing: border-box;
	}
	textarea:focus {
		outline: none;
		border-color: #2196f3;
		box-shadow: 0 0 5px rgba(33, 150, 243, 0.3);
	}
</style>
