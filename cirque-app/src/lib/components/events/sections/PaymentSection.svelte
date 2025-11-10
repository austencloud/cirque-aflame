<script lang="ts">
	import { format } from 'date-fns';

	interface Props {
		formData: any;
		paymentMethodOptions: any[];
	}

	let { formData = $bindable(), paymentMethodOptions }: Props = $props();

	function handleDepositReceivedChange(e: Event) {
		const target = e.target as HTMLInputElement;
		updateDepositReceived(target.checked);
	}

	function handlePaymentPaidChange(e: Event) {
		const target = e.target as HTMLInputElement;
		updatePaymentPaid(target.checked);
	}

	function updateDepositReceived(value: boolean) {
		formData.deposit.received = value;
		formData.deposit.receivedDate = value ? new Date() : null;

		// If deposit received, update status if it's still an inquiry
		if (value && formData.status === 'inquiry') {
			formData.status = 'deposit-received';
		}
	}

	function updatePaymentPaid(value: boolean) {
		formData.payment.paid = value;
		formData.payment.paidDate = value ? new Date() : null;
	}
</script>

<div class="payment-container" data-component="PaymentSection">
	<h4 class="payment-title">Payment Information</h4>
	<div class="payment-content">
		<!-- Total Value -->
		<div class="input-group">
			<label for="totalValue" class="form-label"> Total Event Value </label>
			<div class="currency-input-wrapper">
				<span class="currency-symbol">$</span>
				<input
					type="number"
					id="totalValue"
					bind:value={formData.payment.totalValue}
					min="0"
					step="0.01"
					class="form-input currency-input"
					placeholder="0.00"
				/> <span class="currency-code">USD</span>
			</div>
		</div>
		<!-- Deposit Section -->
		<div class="subsection">
			<h5 class="subsection-title">Deposit</h5>
			<div class="checkbox-group">
				<input
					type="checkbox"
					id="depositRequired"
					checked={formData.deposit.required}
					class="checkbox-input"
				/> <label for="depositRequired" class="checkbox-label"> Deposit Required </label>
			</div>
			{#if formData.deposit.required}
				<div class="deposit-details">
					<div class="input-group">
						<label for="depositAmount" class="form-label small"> Deposit Amount </label>
						<div class="currency-input-wrapper">
							<span class="currency-symbol">$</span>
							<input
								type="number"
								id="depositAmount"
								bind:value={formData.deposit.amount}
								min="0"
								step="0.01"
								class="form-input currency-input"
							/>
						</div>
					</div>
					<div class="checkbox-wrapper">
						<div class="checkbox-group">
							<input
								type="checkbox"
								id="depositReceived"
								checked={formData.deposit.received}
								onchange={handleDepositReceivedChange}
								class="checkbox-input"
							/> <label for="depositReceived" class="checkbox-label"> Deposit Received </label>
							{#if formData.deposit.received && formData.deposit.receivedDate}
								<span class="date-badge">
									({format(new Date(formData.deposit.receivedDate), 'MMM d, yyyy')})
								</span>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
		<!-- Final Payment Section -->
		<div class="subsection">
			<h5 class="subsection-title">Final Payment</h5>
			<div class="checkbox-group">
				<input
					type="checkbox"
					id="paymentPaid"
					checked={formData.payment.paid}
					onchange={handlePaymentPaidChange}
					class="checkbox-input"
				/> <label for="paymentPaid" class="checkbox-label"> Final Payment Received </label>
			</div>
		</div>
		{#if formData.payment.paid}
			<div class="input-group">
				<label for="paymentMethod" class="form-label"> Payment Method </label>
				<select id="paymentMethod" bind:value={formData.payment.method} class="form-input">
					<option value="">Select method</option>
					{#each paymentMethodOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		{/if}
	</div>
</div>

<style>
	.payment-container {
		background: var(--color-gray-50);
		padding: 1rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-gray-200);
	}
	:global(.dark) .payment-container {
		background: var(--color-gray-800);
		border-color: var(--color-gray-700);
	}
	.payment-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-700);
		margin-bottom: 0.75rem;
	}
	:global(.dark) .payment-title {
		color: var(--color-gray-300);
	}
	.payment-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.input-group {
		display: flex;
		flex-direction: column;
	}
	.currency-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		border-radius: var(--radius-md);
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	}
	.currency-symbol {
		position: absolute;
		left: 0.75rem;
		color: var(--color-gray-500);
		font-size: 0.875rem;
		pointer-events: none;
	}
	:global(.dark) .currency-symbol {
		color: var(--color-gray-400);
	}
	.currency-input {
		padding-left: 1.75rem;
		padding-right: 3rem;
	}
	.currency-code {
		position: absolute;
		right: 0.75rem;
		color: var(--color-gray-500);
		font-size: 0.875rem;
		pointer-events: none;
	}
	:global(.dark) .currency-code {
		color: var(--color-gray-400);
	}
	.subsection {
		padding-top: 1rem;
		border-top: 1px solid var(--color-gray-200);
		margin-top: 1rem;
	}
	:global(.dark) .subsection {
		border-top-color: var(--color-gray-700);
	}
	.subsection-title {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-gray-500);
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}
	:global(.dark) .subsection-title {
		color: var(--color-gray-400);
	}
	.checkbox-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
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
	.deposit-details {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 0.75rem;
	}
	.checkbox-wrapper {
		display: flex;
		align-items: flex-end;
	}
	.form-label.small {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-gray-500);
		margin-bottom: 0.25rem;
	}
	:global(.dark) .form-label.small {
		color: var(--color-gray-400);
	}
</style>
