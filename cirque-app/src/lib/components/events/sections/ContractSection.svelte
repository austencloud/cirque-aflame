<script lang="ts">
	import { format } from 'date-fns';
	interface Props {
		formData: any;
	}
	let { formData = $bindable() }: Props = $props();
	function handleContractSentChange(e: Event) {
		const target = e.target as HTMLInputElement;
		updateContractSent(target.checked);
	}
	function handleContractReceivedChange(e: Event) {
		const target = e.target as HTMLInputElement;
		updateContractReceived(target.checked);
	}
	function updateContractSent(value: boolean) {
		formData.contract.sent = value;
		formData.contract.sentDate = value ? new Date() : null;
	}
	function updateContractReceived(value: boolean) {
		formData.contract.received = value;
		formData.contract.receivedDate = value ? new Date() : null;
	}
</script>

<div class="contract-container" data-component="ContractSection">
	<h4 class="contract-title">Contract Information</h4>
	<div class="contract-content">
		<!-- Contract Sent -->
		<div class="checkbox-group">
			<input
				type="checkbox"
				id="contractSent"
				bind:checked={formData.contract.sent}
				onchange={handleContractSentChange}
				class="checkbox-input"
			/> <label for="contractSent" class="checkbox-label"> Contract Sent </label>
			{#if formData.contract.sent && formData.contract.sentDate}
				<span class="date-badge">
					({format(new Date(formData.contract.sentDate), 'MMM d, yyyy')})
				</span>
			{/if}
		</div>
		<!-- Contract Received -->
		<div class="checkbox-group">
			<input
				type="checkbox"
				id="contractReceived"
				checked={formData.contract.received}
				onchange={handleContractReceivedChange}
				class="checkbox-input"
			/> <label for="contractReceived" class="checkbox-label"> Contract Received </label>
			{#if formData.contract.received && formData.contract.receivedDate}
				<span class="date-badge">
					({format(new Date(formData.contract.receivedDate), 'MMM d, yyyy')})
				</span>
			{/if}
		</div>
		<!-- Contract URL -->
		<div class="input-group">
			<label for="contractUrl" class="form-label"> Contract URL </label>
			<input
				type="url"
				id="contractUrl"
				bind:value={formData.contract.url}
				class="form-input"
				placeholder="https://example.com/contract.pdf"
			/>
		</div>
	</div>
</div>

<style>
	.contract-container {
		background: var(--color-gray-50);
		padding: 1rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-gray-200);
	}
	:global(.dark) .contract-container {
		background: var(--color-gray-800);
		border-color: var(--color-gray-700);
	}
	.contract-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-700);
		margin-bottom: 0.75rem;
	}
	:global(.dark) .contract-title {
		color: var(--color-gray-300);
	}
	.contract-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.checkbox-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.checkbox-input {
		height: 1rem;
		width: 1rem;
		color: var(--color-flame-600);
		border: 1px solid var(--color-gray-300);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all var(--transition-base);
	}
	.checkbox-input:focus {
		outline: none;
		box-shadow: var(--shadow-glow-sm);
	}
	:global(.dark) .checkbox-input {
		border-color: var(--color-gray-600);
		background: var(--color-gray-700);
	}
	.checkbox-label {
		font-size: 0.875rem;
		color: var(--color-gray-700);
		cursor: pointer;
	}
	:global(.dark) .checkbox-label {
		color: var(--color-gray-300);
	}
	.date-badge {
		font-size: 0.75rem;
		color: var(--color-gray-500);
	}
	:global(.dark) .date-badge {
		color: var(--color-gray-400);
	}
	.input-group {
		display: flex;
		flex-direction: column;
	}
</style>
