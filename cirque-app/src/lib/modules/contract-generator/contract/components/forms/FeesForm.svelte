<script lang="ts">
	import type { Fees } from '../../domain';
	let { fees = $bindable() }: { fees: Fees } = $props();
	let previousTotalFee = $state(fees.total_fee);
	let previousRequiresDeposit = $state(fees.requires_deposit); // Use $effect to automatically update balance when relevant fields change $effect(() => { // If total fee changed and deposit is required, recalculate deposit if (fees.total_fee !== previousTotalFee && fees.requires_deposit) { fees.deposit_amount = fees.total_fee / 2; } // If deposit checkbox changed if (fees.requires_deposit !== previousRequiresDeposit) { if (fees.requires_deposit) { fees.deposit_amount = fees.total_fee / 2; } else { fees.deposit_amount = 0; } } // Always calculate balance based on current values if (fees.requires_deposit) { fees.balance = fees.total_fee - fees.deposit_amount; } else { fees.balance = fees.total_fee; } previousTotalFee = fees.total_fee; previousRequiresDeposit = fees.requires_deposit; });
</script>

<div class="form-group">
	<h3>Fee Details</h3>
	<div class="form-field">
		<label for="total-fee">Total Fee:</label>
		<input id="total-fee" type="number" bind:value={fees.total_fee} min="0" step="10" />
	</div>
	<div class="form-field">
		<label> <input type="checkbox" bind:checked={fees.requires_deposit} /> Require Deposit </label>
	</div>
	{#if fees.requires_deposit}
		<div class="form-field">
			<label for="deposit-amount">Deposit Amount:</label>
			<input id="deposit-amount" type="number" bind:value={fees.deposit_amount} min="0" step="10" />
		</div>
	{/if}
	<div class="form-field">
		<label for="balance">Remaining Balance:</label>
		<input id="balance" type="number" value={fees.balance} disabled readonly />
	</div>
	<div class="form-field">
		<label for="payment-methods">Payment Methods:</label>
		<textarea
			id="payment-methods"
			bind:value={fees.payment_methods}
			placeholder="List accepted payment methods"
			rows="3"
		></textarea>
	</div>
	<div class="form-field">
		<label for="payment-terms">Payment Terms:</label>
		<textarea
			id="payment-terms"
			bind:value={fees.payment_terms}
			placeholder="Enter payment terms and conditions"
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
	input[type='checkbox'] {
		width: auto;
		margin-right: 8px;
	}
	input:disabled {
		background-color: #f0f0f0;
		cursor: not-allowed;
	}
</style>
