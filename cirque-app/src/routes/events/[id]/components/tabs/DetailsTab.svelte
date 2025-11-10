<!-- src/routes/events/[id]/components/tabs/DetailsTab.svelte -->
<script lang="ts">
	import { format } from 'date-fns';
	import Icon from '$lib/components/ui/Icon.svelte';
	interface Props {
		event: any;
		eventPerformers?: any[];
	}
	const { event, eventPerformers = [] }: Props = $props();
	const totalPay = $derived(eventPerformers.reduce((sum, p) => sum + (p.pay || 0), 0));
	const profit = $derived(event?.payment.totalValue ? event.payment.totalValue - totalPay : 0);
</script>

<div class="details-" data-component="DetailsTab">
	<!-- Event Details -->
	<div class="details-card">
		<h2 class="card-title">Event Details</h2>
		<div class="details-content">
			<div class="detail-section">
				<h3 class="section-label">Date & Time</h3>
				<div class="detail-items">
					<div class="detail-item">
						<Icon name="calendar" size={16} extraClass="detail-icon" />
						<p class="detail-text">{format(event.date, 'EEEE, MMMM d, yyyy')}</p>
					</div>
					<div class="detail-item">
						<Icon name="clock" size={16} extraClass="detail-icon" />
						<p class="detail-text">
							Performance: {event.performanceTime.start} - {event.performanceTime.end}
						</p>
					</div>
					{#if event.callTime}
						<div class="detail-item">
							<Icon name="alert-circle" size={16} extraClass="detail-icon" />
							<p class="detail-text">Call Time: {event.callTime}</p>
						</div>
					{/if}
				</div>
			</div>
			<div class="detail-section">
				<h3 class="section-label">Location</h3>
				<div class="detail-items">
					<div class="detail-item">
						<Icon name="map-pin" size={16} extraClass="detail-icon-top" />
						<p class="detail-text">{event.location.address}</p>
					</div>
					{#if event.location.notes}
						<div class="detail-item">
							<Icon name="info" size={16} extraClass="detail-icon-top" />
							<p class="detail-text">{event.location.notes}</p>
						</div>
					{/if}
					{#if event.location.mapLink}
						<div class="map-link-wrapper">
							<a
								href={event.location.mapLink}
								target="_blank"
								rel="noopener noreferrer"
								class="map-link"
							>
								<Icon name="external-link" size={14} extraClass="mr-1" /> Open in Maps
							</a>
						</div>
					{/if}
				</div>
			</div>
			<div class="detail-section">
				<h3 class="section-label">Services</h3>
				<div class="tags-container">
					{#each event.services as service} <span class="service-tag"> {service} </span> {/each}
				</div>
			</div>
			<div class="detail-section">
				<h3 class="section-label">Equipment & Costumes</h3>
				<div class="detail-items">
					{#if event.costume}
						<div class="detail-item">
							<Icon name="shirt" size={16} extraClass="detail-icon-top" />
							<p class="detail-text">Costume: {event.costume}</p>
						</div>
					{/if}
					{#if event.equipmentNeeded && event.equipmentNeeded.length > 0}
						<div class="detail-item">
							<Icon name="package" size={16} extraClass="detail-icon-top" />
							<div class="equipment-list">
								<p class="equipment-title">Equipment Needed:</p>
								<ul class="equipment-items">
									{#each event.equipmentNeeded as item} <li>{item}</li> {/each}
								</ul>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<!-- Client & Management Summary -->
	<div class="summary-container">
		<div class="summary-card">
			<h2 class="card-title">Management Summary</h2>
			<div class="summary-content">
				<div class="summary-row">
					<span class="summary-label">Client Liaison:</span>
					<span class="summary-value">{event.clientLiaison}</span>
				</div>
				<div class="summary-row">
					<span class="summary-label">Gig Manager:</span>
					<span class="summary-value">{event.gigManager}</span>
				</div>
				<div class="summary-row">
					<span class="summary-label">Created:</span>
					<span class="summary-value">{format(event.createdAt, 'MMM d, yyyy')}</span>
				</div>
				<div class="summary-row">
					<span class="summary-label">Last Updated:</span>
					<span class="summary-value">{format(event.updatedAt, 'MMM d, yyyy')}</span>
				</div>
			</div>
		</div>
		<div class="summary-card">
			<h2 class="card-title">Financial Summary</h2>
			<div class="summary-content">
				<div class="summary-row">
					<span class="summary-label">Event Value:</span>
					<span class="summary-value">${event.payment.totalValue.toFixed(2)}</span>
				</div>
				<div class="summary-row">
					<span class="summary-label">Performer Pay:</span>
					<span class="summary-value">${totalPay.toFixed(2)}</span>
				</div>
				<div class="summary-row profit-row">
					<span class="summary-label profit">Profit:</span>
					<span class="summary-value profit">${profit.toFixed(2)}</span>
				</div>
				{#if event.deposit.required}
					<div class="deposit-section">
						<div class="summary-row">
							<span class="summary-label">Deposit Required:</span>
							<span class="summary-value">${event.deposit.amount?.toFixed(2) || 'N/A'}</span>
						</div>
						<div class="summary-row">
							<span class="summary-label">Deposit Status:</span>
							<span
								class="summary-value"
								class:success={event.deposit.received}
								class:warning={!event.deposit.received}
							>
								{event.deposit.received ? 'Received' : 'Pending'}
							</span>
						</div>
						{#if event.deposit.received && event.deposit.receivedDate}
							<div class="summary-row">
								<span class="summary-label">Date Received:</span>
								<span class="summary-value"
									>{format(event.deposit.receivedDate, 'MMM d, yyyy')}</span
								>
							</div>
						{/if}
					</div>
				{/if}
				<div class="payment-section">
					<div class="summary-row">
						<span class="summary-label">Payment Status:</span>
						<span
							class="summary-value"
							class:success={event.payment.paid}
							class:warning={!event.payment.paid}
						>
							{event.payment.paid ? 'Paid' : 'Unpaid'}
						</span>
					</div>
					{#if event.payment.paid && event.payment.paidDate}
						<div class="summary-row">
							<span class="summary-label">Date Paid:</span>
							<span class="summary-value">{format(event.payment.paidDate, 'MMM d, yyyy')}</span>
						</div>
					{/if}
					{#if event.payment.paid && event.payment.method}
						<div class="summary-row">
							<span class="summary-label">Payment Method:</span>
							<span class="summary-value">{event.payment.method}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.details-grid {
		display: grid;
		gap: 1.5rem;
	}
	@media (min-width: 768px) {
		.details-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	.details-card {
		background: var(--surface-color);
		border-radius: var(--border-radius);
		box-shadow: var(--shadow-sm);
		padding: 1rem;
	}
	.card-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 1rem;
	}
	.details-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.detail-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.section-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
	}
	.detail-items {
		margin-top: 0.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	:global(.detail-icon) {
		color: var(--text-tertiary);
	}
	:global(.detail-icon-top) {
		color: var(--text-tertiary);
		margin-top: 0.25rem;
		align-self: flex-start;
	}
	.detail-text {
		flex: 1;
		color: var(--text-primary);
	}
	.map-link-wrapper {
		margin-top: 0.5rem;
	}
	.map-link {
		color: var(--primary-color);
		text-decoration: none;
		font-size: 0.875rem;
		display: inline-flex;
		align-items: center;
	}
	.map-link:hover {
		text-decoration: underline;
	}
	.tags-container {
		margin-top: 0.25rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}
	.service-tag {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		border-radius: 9999px;
		background: rgba(59, 130, 246, 0.1);
		color: rgb(30, 64, 175);
	}
	.equipment-list {
		flex: 1;
	}
	.equipment-title {
		font-weight: 500;
		color: var(--text-primary);
	}
	.equipment-items {
		list-style: disc;
		padding-left: 1.25rem;
		margin-top: 0.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		color: var(--text-primary);
	}
	.summary-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.summary-card {
		background: var(--surface-color);
		border-radius: var(--border-radius);
		box-shadow: var(--shadow-sm);
		padding: 1rem;
	}
	.summary-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.summary-row {
		display: flex;
		justify-content: space-between;
	}
	.summary-label {
		color: var(--text-secondary);
	}
	.summary-value {
		font-weight: 500;
		color: var(--text-primary);
	}
	.summary-value.success {
		color: var(--success-color);
	}
	.summary-value.warning {
		color: var(--warning-color);
	}
	.profit-row {
		border-top: 1px solid var(--border-color);
		padding-top: 0.5rem;
		margin-top: 0.5rem;
	}
	.summary-label.profit {
		color: var(--text-primary);
		font-weight: 500;
	}
	.summary-value.profit {
		font-weight: 700;
		color: rgb(21, 128, 61);
	}
	.deposit-section {
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.payment-section {
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	:global(.dark) .details-card,
	:global(.dark) .summary-card {
		background: var(--surface-color-dark);
	}
	:global(.dark) .card-title,
	:global(.dark) .detail-text,
	:global(.dark) .equipment-title,
	:global(.dark) .equipment-items,
	:global(.dark) .summary-value,
	:global(.dark) .summary-label.profit {
		color: var(--text-primary-dark);
	}
	:global(.dark) .section-label,
	:global(.dark) .summary-label {
		color: var(--text-secondary-dark);
	}
	:global(.dark) .service-tag {
		background: rgba(59, 130, 246, 0.2);
		color: rgb(147, 197, 253);
	}
	:global(.dark) .profit-row,
	:global(.dark) .deposit-section,
	:global(.dark) .payment-section {
		border-color: var(--border-color-dark);
	}
	:global(.dark) .summary-value.profit {
		color: rgb(134, 239, 172);
	}
</style>
