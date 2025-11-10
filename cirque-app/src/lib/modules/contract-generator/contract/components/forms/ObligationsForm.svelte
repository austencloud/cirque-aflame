<script lang="ts">
	import type { Obligations } from '../../domain';
	let { obligations = $bindable() }: { obligations: Obligations } = $props();
</script>

<div class="form-group">
	<h3>Producer Obligations</h3>
	<div class="form-field">
		<textarea
			bind:value={obligations.producer_obligations}
			placeholder="Enter obligations for the producer/performer"
			rows="5"
		></textarea>
	</div>
</div>
<div class="form-group">
	<h3>Client Obligations</h3>
	<div class="form-field">
		<textarea
			bind:value={obligations.client_obligations}
			placeholder="Enter obligations for the client"
			rows="5"
		></textarea>
	</div>
</div>
<div class="form-group">
	<h3>Venue and Technical Requirements</h3>
	<div class="form-field">
		<textarea
			bind:value={obligations.venue_requirements}
			placeholder="Enter any specific venue or technical requirements"
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
