<script lang="ts">
	import type { Safety } from '../../domain';
	let { safety = $bindable() }: { safety: Safety } = $props();
</script>

<div class="form-group">
	<h3>General Safety Policy</h3>
	<div class="form-field">
		<textarea
			bind:value={safety.general_safety_policy}
			placeholder="Enter general health and safety policy"
			rows="4"
		></textarea>
	</div>
</div>
<div class="form-group">
	<h3>Specific Safety Requirements</h3>
	<div class="form-field">
		<textarea
			bind:value={safety.specific_requirements}
			placeholder="Enter any specific safety requirements for this performance"
			rows="5"
		></textarea>
	</div>
</div>
<div class="form-group">
	<h3>Liability and Insurance</h3>
	<div class="form-field">
		<textarea
			bind:value={safety.liability_terms}
			placeholder="Enter liability and insurance terms"
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
